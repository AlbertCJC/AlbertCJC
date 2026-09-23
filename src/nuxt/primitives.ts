import { defineComponent, ref, computed, onMounted } from "vue/dist/vue.esm-bundler.js";
import { onScrollFrame, viewportProgress, clamp, lerp } from "./composables";

/* ------------------------------------------------------------------ *
 * <SplitHeading> — line-masked, per-word stagger reveal
 * ------------------------------------------------------------------ */
export const SplitHeading = defineComponent({
  name: "SplitHeading",
  props: {
    text: { type: String, required: true },
    tag: { type: String, default: "h2" },
    delay: { type: Number, default: 0 },
  },
  setup(props: any) {
    const root = ref<HTMLElement | null>(null);
    const shown = ref(false);

    /**
     * Words are plain text — never HTML. To emphasise a word, wrap it in
     * asterisks:  "Tailored *specifically* for you".
     * This keeps each word a self-contained, safely-escaped token so markup
     * can never be split across two animated spans.
     */
    const words = computed(() =>
      String(props.text)
        .split(/\s+/)
        .filter(Boolean)
        .map((raw: string) => {
          const accent = raw.startsWith("*") || raw.endsWith("*");
          return { text: raw.replace(/\*/g, ""), accent };
        })
    );

    onScrollFrame(() => {
      if (shown.value || !root.value) return;
      if (viewportProgress(root.value) > 0.22) shown.value = true;
    });
    return { root, shown, words };
  },
  template: `
    <component :is="tag" ref="root" class="split-heading">
      <span v-for="(w, i) in words" :key="i" class="split-word">
        <span
          class="split-inner"
          :class="[shown ? 'up' : '', w.accent ? 'italic text-accent' : '']"
          :style="{ transitionDelay: (delay + i * 55) + 'ms' }"
        >{{ w.text }}</span>
      </span>
    </component>
  `,
});

/* ------------------------------------------------------------------ *
 * <ParallaxMedia> — image drifts + scales inside a masked frame
 * ------------------------------------------------------------------ */
export const ParallaxMedia = defineComponent({
  name: "ParallaxMedia",
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: "" },
    strength: { type: Number, default: 90 },
    rounded: { type: String, default: "rounded-2xl" },
    height: { type: String, default: "h-[280px] sm:h-[460px]" },
  },
  setup(props: any) {
    const frame = ref<HTMLElement | null>(null);
    const img = ref<HTMLElement | null>(null);
    const mask = ref(0);
    onScrollFrame(() => {
      if (!frame.value || !img.value) return;
      const p = viewportProgress(frame.value);
      const y = lerp(props.strength, -props.strength, p);
      img.value.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(1.28)`;
      mask.value = clamp((p - 0.12) / 0.3);
    });
    return { frame, img, mask };
  },
  template: `
    <div ref="frame" class="relative overflow-hidden bg-white/5" :class="[rounded, height]">
      <div
        class="absolute inset-0 origin-bottom bg-ink z-10 transition-none"
        :style="{ transform: 'scaleY(' + (1 - mask) + ')' }"
      ></div>
      <img ref="img" :src="src" :alt="alt" loading="lazy" class="h-full w-full object-cover will-change-transform" />
      <slot />
    </div>
  `,
});

/* ------------------------------------------------------------------ *
 * <CountUp> — number ticks up once in view
 * ------------------------------------------------------------------ */
export const CountUp = defineComponent({
  name: "CountUp",
  props: { value: { type: String, required: true } },
  setup(props: any) {
    const root = ref<HTMLElement | null>(null);
    const out = ref("0");
    const done = ref(false);
    const num = parseFloat(props.value.replace(/[^\d.]/g, "")) || 0;
    const suffix = props.value.replace(/[\d.]/g, "");
    onScrollFrame(() => {
      if (done.value || !root.value) return;
      if (viewportProgress(root.value) > 0.3) {
        done.value = true;
        const t0 = performance.now();
        const dur = 1400;
        const tick = (t: number) => {
          const k = clamp((t - t0) / dur);
          const e = 1 - Math.pow(1 - k, 4);
          out.value = Math.round(num * e) + (k === 1 ? suffix : "");
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    return { root, out };
  },
  template: `<span ref="root">{{ out }}</span>`,
});

/* ------------------------------------------------------------------ *
 * <Magnetic> — element pulls toward cursor
 * ------------------------------------------------------------------ */
export const Magnetic = defineComponent({
  name: "Magnetic",
  props: { strength: { type: Number, default: 0.35 } },
  setup(props: any) {
    const el = ref<HTMLElement | null>(null);
    onMounted(() => {
      const node = el.value;
      if (!node) return;
      node.addEventListener("mousemove", (e: MouseEvent) => {
        const r = node.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * props.strength;
        const dy = (e.clientY - (r.top + r.height / 2)) * props.strength;
        node.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
      node.addEventListener("mouseleave", () => {
        node.style.transform = "translate3d(0,0,0)";
      });
    });
    return { el };
  },
  template: `<span ref="el" class="magnetic inline-block"><slot /></span>`,
});

/* ------------------------------------------------------------------ *
 * <FadeUp> — generic in-view transition wrapper
 * ------------------------------------------------------------------ */
export const FadeUp = defineComponent({
  name: "FadeUp",
  props: { delay: { type: Number, default: 0 }, y: { type: Number, default: 34 } },
  setup(props: any) {
    const root = ref<HTMLElement | null>(null);
    const shown = ref(false);
    onScrollFrame(() => {
      if (shown.value || !root.value) return;
      if (viewportProgress(root.value) > 0.2) shown.value = true;
    });
    return { root, shown, props };
  },
  template: `
    <div
      ref="root"
      :style="{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translate3d(0,' + y + 'px,0)',
        transitionDelay: delay + 'ms'
      }"
      class="transition-all duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]"
    ><slot /></div>
  `,
});
