import { defineComponent, ref, computed } from "vue/dist/vue.esm-bundler.js";
import { onScrollFrame, viewportProgress } from "./composables";
import { SplitHeading, FadeUp } from "./primitives";
import { tenets, fitModes } from "../data";

/** Commitments, not credentials — nothing here claims a track record. */
const commitments = [
  { value: "You", label: "Own the code" },
  { value: "Fixed", label: "Price, quoted upfront" },
  { value: "30d", label: "Bug fixes after launch" },
];

/* ================================================================== *
 * components/PromiseBand.vue
 * The phrase as a full-bleed statement, drawn like a pattern piece.
 * ================================================================== */
export const PromiseBand = defineComponent({
  name: "PromiseBand",
  setup() {
    const root = ref<HTMLElement | null>(null);
    const p = ref(0);
    const on = ref(false);
    onScrollFrame(() => {
      if (!root.value) return;
      p.value = viewportProgress(root.value);
      if (p.value > 0.3) on.value = true;
    });
    return { root, p, on, commitments };
  },
  template: `
    <section ref="root" class="relative overflow-hidden border-y border-white/10 bg-white/[0.02] py-24 lg:py-36">
      <div class="tick-rule-lg absolute inset-x-0 top-0 opacity-40"></div>
      <div class="tick-rule-lg absolute inset-x-0 bottom-0 rotate-180 opacity-40"></div>

      <div class="mx-auto max-w-7xl px-6 lg:px-10">
        <div class="crop relative py-10">
          <p class="spec-note mb-8">The promise · fig. A</p>

          <h2 class="font-serif text-[10vw] leading-[0.94] sm:text-[7vw] lg:text-[5.4rem]">
            <span class="relative inline-block">
              Detail oriented
              <span class="draw-line absolute -bottom-1 left-0 h-px w-full bg-accent" :class="on ? 'on' : ''"></span>
            </span>,
            <span class="italic text-accent">tailored</span>
            specifically<br class="hidden lg:block" />
            for your needs.
          </h2>

          <div class="mt-12 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <p class="max-w-xl leading-relaxed text-bone/55">
              Your site gets built for your content and your customers. Not a theme
              with your logo dropped into it. I show you layouts before writing code,
              and you approve them before I build.
            </p>
            <div class="flex items-end gap-8">
              <div v-for="m in commitments" :key="m.label" class="text-right">
                <div class="font-serif text-3xl text-bone lg:text-4xl">{{ m.value }}</div>
                <div class="spec-note mt-2">{{ m.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="pointer-events-none absolute left-0 top-1/2 h-px w-full bg-accent/30"
        :style="{ transform: 'scaleX(' + p + ')', transformOrigin: 'left' }"
      ></div>
    </section>
  `,
});

/* ================================================================== *
 * components/FitSelector.vue
 * "Tailored to your needs" made literal — pick your engagement fit.
 * ================================================================== */
export const FitSelector = defineComponent({
  name: "FitSelector",
  components: { SplitHeading },
  setup() {
    const active = ref(1);
    const current = computed(() => fitModes[active.value]);
    return { fitModes, active, current };
  },
  template: `
    <section id="fit" class="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
      <p class="mb-6 text-xs uppercase tracking-[0.3em] text-accent">Tailored — pick your scope</p>
      <SplitHeading text="Three ways to work together." class="mb-4 font-serif text-4xl lg:text-7xl" />
      <p class="mb-14 max-w-xl leading-relaxed text-bone/50">
        Three common shapes. Tell me which sounds closest and I'll quote a fixed
        price on the call — or tell you if what you need doesn't fit any of them.
      </p>

      <div class="mb-10 flex flex-wrap gap-2 border-b border-white/10 pb-4">
        <button
          v-for="(f, i) in fitModes" :key="f.name"
          class="rounded-full px-5 py-2.5 text-sm transition-all duration-500"
          :class="active === i ? 'bg-accent text-bone' : 'border border-white/15 text-bone/50 hover:text-bone'"
          @click="active = i"
        >{{ f.name }}</button>
      </div>

      <div class="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div class="flex items-baseline gap-5">
            <h3 class="font-serif text-4xl lg:text-6xl">{{ current.name }}</h3>
            <span class="spec-note">{{ current.tag }}</span>
          </div>
          <p class="mt-5 max-w-lg leading-relaxed text-bone/60">{{ current.desc }}</p>
          <div class="stitch my-9 max-w-md"></div>
          <div class="flex flex-wrap gap-x-12 gap-y-5">
            <div>
              <div class="spec-note mb-1">Typical length</div>
              <div class="font-serif text-2xl">{{ current.length }}</div>
            </div>
            <div>
              <div class="spec-note mb-1">Investment</div>
              <div class="font-serif text-2xl">{{ current.price }}</div>
            </div>
            <div>
              <div class="spec-note mb-1">Best for</div>
              <div class="font-serif text-2xl">{{ current.bestFor }}</div>
            </div>
          </div>
        </div>

        <ul class="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-1">
          <li v-for="(inc, i) in current.includes" :key="inc"
            class="flex items-center gap-4 bg-ink px-6 py-5 text-sm text-bone/70">
            <span class="tabular text-[10px] text-accent">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="stitch-v h-5"></span>
            {{ inc }}
          </li>
        </ul>
      </div>
    </section>
  `,
});

/* ================================================================== *
 * components/TenetGrid.vue — "detail oriented", itemised
 * ================================================================== */
export const TenetGrid = defineComponent({
  name: "TenetGrid",
  components: { SplitHeading, FadeUp },
  setup() {
    /** Focus-pull: hovering one card sharpens it and blurs its siblings. */
    const hover = ref(-1);
    const focus = (i: number) => {
      const on = hover.value > -1 && hover.value !== i;
      return {
        filter: on ? "blur(3.5px) saturate(0.5)" : "blur(0px) saturate(1)",
        opacity: on ? 0.3 : 1,
        backgroundColor:
          hover.value === i ? "rgba(244, 241, 236, 0.05)" : "rgba(244, 241, 236, 0)",
        transition: [
          "filter 550ms cubic-bezier(.16,1,.3,1)",
          "opacity 550ms cubic-bezier(.16,1,.3,1)",
          "background-color 500ms cubic-bezier(.16,1,.3,1)",
        ].join(", "),
      };
    };
    return { tenets, hover, focus };
  },
  template: `
    <section class="border-y border-white/10 bg-white/[0.02]">
      <div class="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
        <p class="mb-6 text-xs uppercase tracking-[0.3em] text-bone/40">Detail oriented — the checklist</p>
        <SplitHeading text="Six things I do that never make it into a brief."
          class="mb-16 max-w-4xl font-serif text-4xl leading-[1.05] lg:text-6xl" />

        <div class="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3"
          @mouseleave="hover = -1">
          <FadeUp
            v-for="(t, i) in tenets" :key="t.title" :delay="i * 70"
            class="bg-ink"
          >
            <div
              class="h-full p-8"
              :style="focus(i)"
              @mouseenter="hover = i"
            >
              <div class="mb-6 flex items-center justify-between">
                <span class="tabular text-[10px] tracking-[0.25em] transition-colors duration-500"
                  :class="hover === i ? 'text-accent' : 'text-accent/60'">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="tick-rule w-20 transition-opacity duration-500"
                  :class="hover === i ? 'opacity-100' : 'opacity-35'"></span>
              </div>
              <h3 class="font-serif text-2xl leading-snug transition-transform duration-[600ms] ease-[cubic-bezier(.16,1,.3,1)]"
                :class="hover === i ? 'translate-x-1 text-bone' : 'text-bone/85'">{{ t.title }}</h3>
              <p class="mt-3 text-sm leading-relaxed transition-colors duration-500"
                :class="hover === i ? 'text-bone/70' : 'text-bone/45'">{{ t.desc }}</p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  `,
});
