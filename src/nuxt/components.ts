import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onUnmounted,
} from "vue/dist/vue.esm-bundler.js";
import { projects, services, process, owner } from "../data";
import { StackSection } from "./faq";
import { onScrollFrame, usePageProgress, useFinePointer, clamp, lerp } from "./composables";
import { SplitHeading, ParallaxMedia, Magnetic, FadeUp } from "./primitives";

/* ================================================================== *
 * components/AppLogo.vue — "The Aperture" system mark
 * ================================================================== */
export const AppLogo = defineComponent({
  name: "AppLogo",
  props: {
    size: { type: Number, default: 36 },
    tone: { type: String, default: "currentColor" },
  },
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none"
      :width="size" :height="size" role="img" aria-label="AlbertCJC aperture logo">
      <path d="M100 38.8 A44 44 0 1 0 100 89.2" :stroke="tone" stroke-width="15" stroke-linecap="butt"/>
      <path d="M44 98 L64 46 L84 98" :stroke="tone" stroke-width="15" stroke-linejoin="miter"/>
      <path d="M54 66 H100 V73 A10 10 0 0 1 90 83 H84" :stroke="tone" stroke-width="12"/>
    </svg>
  `,
});

/* Removed: BackdropLogo — it was position:fixed, so it hung in place
   while the page scrolled past it. The remaining watermarks live inside
   the hero and contact sections and travel with them. */

/* ================================================================== *
 * components/BackdropLogo.vue
 * The one background aperture. Fixed layer at z-0; its vertical position
 * is driven by page scroll, so it travels from the top of the viewport
 * down to the bottom and lands with the footer.
 * ================================================================== */
export const BackdropLogo = defineComponent({
  name: "BackdropLogo",
  components: { AppLogo },
  setup() {
    const ty = ref(0);
    const rot = ref(0);
    const size = ref(560);
    onScrollFrame(() => {
      const vh = window.innerHeight;
      const s = Math.min(window.innerWidth * 0.55, 620);
      size.value = s;
      const max = document.documentElement.scrollHeight - vh;
      const p = max > 0 ? clamp(window.scrollY / max) : 0;
      ty.value = p * (vh - s); // top of viewport → bottom of viewport
      rot.value = p * 200;
    });
    return { ty, rot, size };
  },
  template: `
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <AppLogo
        tone="#f4f1ec"
        :size="size"
        class="absolute right-[-10vw] top-0 opacity-[0.075] sm:opacity-[0.095]"
        :style="{
          width: size + 'px', height: 'auto',
          transform: 'translateY(' + ty + 'px) rotate(' + rot + 'deg)'
        }"
      />
    </div>
  `,
});

/* ================================================================== *
 * components/CustomCursor.vue — accent spotlight, not a fake pointer
 * ================================================================== */
export const CustomCursor = defineComponent({
  name: "CustomCursor",
  setup() {
    const spot = ref<HTMLElement | null>(null);
    const fine = useFinePointer();
    let tx = 0, ty = 0, x = 0, y = 0, size = 640, target = 640, raf = 0, idle = 0, visible = false;
    const loop = () => {
      x = lerp(x, tx, 0.12);
      y = lerp(y, ty, 0.12);
      size = lerp(size, target, 0.08);
      if (spot.value) {
        spot.value.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        spot.value.style.width = size.toFixed(1) + "px";
        spot.value.style.height = size.toFixed(1) + "px";
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      window.clearTimeout(idle);
      idle = window.setTimeout(stop, 2000);
      if (!visible && spot.value) {
        visible = true;
        x = tx;
        y = ty;
        spot.value.style.opacity = "1";
      }
      start();
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      target = t.closest("a,button,input,textarea,[data-hot]") ? 860 : 640;
    };
    onMounted(() => {
      /* `.spotlight` is display:none on touch (index.css, `@media (hover: none)`),
         so the loop would spend 60fps writing into a hidden element. It also
         only runs while the pointer is actually moving. */
      if (!fine.value) return;
      window.addEventListener("mousemove", move, { passive: true });
      window.addEventListener("mouseover", over, { passive: true });
    });
    onUnmounted(() => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.clearTimeout(idle);
      stop();
    });
    return { spot };
  },
  template: `<div ref="spot" class="spotlight" aria-hidden="true"></div>`,
});

/* ================================================================== *
 * components/ScrollHud.vue — progress rail + live readout
 * ================================================================== */
export const ScrollHud = defineComponent({
  name: "ScrollHud",
  setup() {
    const progress = usePageProgress();
    const marks = ["Intro", "Work", "Studio", "Process", "Craft", "Contact"];
    const pct = computed(() => String(Math.round(progress.value * 100)).padStart(3, "0"));
    const active = computed(() =>
      Math.min(marks.length - 1, Math.floor(progress.value * marks.length))
    );
    return { progress, marks, pct, active };
  },
  template: `
    <div class="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div class="flex items-center gap-4">
        <div class="flex flex-col items-end gap-3">
          <span
            v-for="(m, i) in marks" :key="m"
            class="text-[10px] uppercase tracking-[0.25em] transition-all duration-500"
            :class="i === active ? 'text-accent' : 'text-bone/25'"
          >{{ m }}</span>
        </div>
        <div class="relative h-56 w-px bg-white/15">
          <div class="hud-line absolute inset-x-0 top-0 h-full bg-accent"
            :style="{ transform: 'scaleY(' + progress + ')' }"></div>
        </div>
      </div>
      <div class="mt-5 text-right text-[10px] tabular tracking-[0.3em] text-bone/35">{{ pct }}</div>
    </div>
  `,
});

/* ================================================================== *
 * components/SiteNav.vue
 * ================================================================== */
export const SiteNav = defineComponent({
  name: "SiteNav",
  components: { AppLogo, Magnetic },
  setup() {
    const hidden = ref(false);
    const solid = ref(false);
    const open = ref(false);
    const spin = ref(0);
    let last = 0;
    const links = [
      { label: "Work", href: "#work" },
      { label: "About", href: "#studio" },
      { label: "Services", href: "#fit" },
      { label: "Process", href: "#process" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ];
    const active = ref(-1);
    const navRef = ref<HTMLElement | null>(null);
    const pill = ref({ x: 0, w: 0, on: false });

    const syncPill = () => {
      const nav = navRef.value;
      if (!nav) return;
      const items = nav.querySelectorAll<HTMLElement>("[data-nav]");
      const el = items[active.value];
      if (!el) { pill.value = { ...pill.value, on: false }; return; }
      pill.value = { x: el.offsetLeft, w: el.offsetWidth, on: true };
    };

    onScrollFrame(() => {
      const y = window.scrollY;
      solid.value = y > 24;
      const away = y > 520 && y > last + 2;
      last = y;
      spin.value = y * 0.22;

      /* Scrolling dismisses the sheet, but never on the same frame it closed
         — otherwise the toggle scrolls away from under the finger with no
         way back to it. `wasOpen` also keeps the header on screen for that
         one gesture. */
      const wasOpen = open.value;
      if (away && wasOpen) open.value = false;
      hidden.value = away && !wasOpen;

      // scroll-spy
      let found = -1;
      links.forEach((l, i) => {
        const sec = document.querySelector(l.href);
        if (!sec) return;
        const r = sec.getBoundingClientRect();
        if (r.top <= window.innerHeight * 0.4 && r.bottom > window.innerHeight * 0.35) found = i;
      });
      if (found !== active.value) { active.value = found; syncPill(); }
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") open.value = false;
    };
    onMounted(() => {
      window.addEventListener("keydown", onKey);
      onUnmounted(() => window.removeEventListener("keydown", onKey));
    });

    return { hidden, solid, open, links, spin, active, navRef, pill };
  },
  template: `
    <header
      class="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 transition-all duration-[700ms] ease-[cubic-bezier(.16,1,.3,1)] sm:px-6"
      :class="[
        solid ? 'pt-3 lg:pt-4' : 'pt-5 lg:pt-7',
        hidden ? '-translate-y-[160%] opacity-0' : 'translate-y-0 opacity-100'
      ]"
    >
      <div
        class="glass pointer-events-auto relative flex w-full max-w-5xl items-center justify-between gap-6 overflow-hidden rounded-full transition-all duration-[700ms] ease-[cubic-bezier(.16,1,.3,1)]"
        :class="solid ? 'py-1.5 pl-3 pr-3 lg:pl-4' : 'py-2 pl-4 pr-3 lg:pl-5'"
      >
        <!-- brand -->
        <a href="#top" class="group relative z-10 -m-2 flex shrink-0 items-center gap-3 p-2">
          <span class="grid place-items-center rounded-full border border-white/15 bg-bone/[0.07] text-bone transition-all duration-500 group-hover:border-accent group-hover:bg-accent/15 group-hover:text-accent"
            :class="solid ? 'h-9 w-9 p-1.5' : 'h-10 w-10 p-2'">
            <AppLogo :size="solid ? 22 : 24" :style="{ transform: 'rotate(' + spin + 'deg)', transition: 'width .5s, height .5s' }" />
          </span>
          <span class="hidden flex-col leading-none sm:flex">
            <span class="text-[13px] uppercase tracking-[0.2em] text-bone/90">John Albert</span>
            <span class="mt-1 text-[9px] uppercase tracking-[0.28em] text-bone/35">Full Stack Dev</span>
          </span>
        </a>

        <!-- links with sliding glass pill -->
        <nav ref="navRef" class="relative z-10 hidden items-center md:flex">
          <span
            class="glass-pill absolute top-1/2 -z-10 h-9 -translate-y-1/2 rounded-full transition-all duration-[600ms] ease-[cubic-bezier(.16,1,.3,1)]"
            :style="{ left: pill.x + 'px', width: pill.w + 'px', opacity: pill.on ? 1 : 0 }"
          ></span>
          <a v-for="(l, i) in links" :key="l.href" :href="l.href" data-nav
            class="group relative overflow-hidden rounded-full px-4 py-2 text-[13px] transition-colors duration-500"
            :class="active === i ? 'text-bone' : 'text-bone/55 hover:text-bone'">
            <span class="block transition-transform duration-500 group-hover:-translate-y-full">{{ l.label }}</span>
            <span class="absolute inset-0 flex translate-y-full items-center justify-center text-accent transition-transform duration-500 group-hover:translate-y-0">{{ l.label }}</span>
          </a>
        </nav>

        <!-- cta -->
        <div class="relative z-10 flex shrink-0 items-center gap-2">
          <Magnetic :strength="0.25" class="hidden md:block">
            <a href="#contact" class="block rounded-full bg-bone px-5 py-2.5 text-[13px] font-medium text-ink transition-colors duration-400 hover:bg-accent hover:text-bone">
              Start a project
            </a>
          </Magnetic>
          <button
            class="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-bone/[0.07] md:hidden"
            :aria-expanded="open" aria-label="Toggle menu" @click="open = !open">
            <span class="relative block h-3 w-4">
              <span class="absolute left-0 block h-px w-full bg-bone transition-all duration-400"
                :style="{ top: open ? '6px' : '1px', transform: open ? 'rotate(45deg)' : 'none' }"></span>
              <span class="absolute left-0 block h-px w-full bg-bone transition-all duration-400"
                :style="{ top: open ? '6px' : '11px', transform: open ? 'rotate(-45deg)' : 'none' }"></span>
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- mobile sheet: its own floating glass island -->
    <div
      class="pointer-events-none fixed inset-x-0 z-40 flex justify-center px-4 transition-all duration-[600ms] ease-[cubic-bezier(.16,1,.3,1)] sm:px-6 md:hidden"
      :class="open ? 'top-[5.5rem] opacity-100' : 'top-[4rem] pointer-events-none opacity-0'"
      :inert="!open"
      :aria-hidden="!open"
    >
      <div class="glass pointer-events-auto w-full max-w-5xl overflow-hidden rounded-3xl p-3"
        :class="open ? '' : 'pointer-events-none'">
        <a v-for="(l, i) in links" :key="l.href" :href="l.href"
          class="relative z-10 flex items-center justify-between rounded-2xl px-4 py-3 font-serif text-2xl transition-colors hover:bg-white/5"
          :class="active === i ? 'text-accent' : 'text-bone'"
          @click="open = false">
          {{ l.label }}
          <span class="tabular text-[10px] tracking-[0.2em] text-bone/30">{{ String(i + 1).padStart(2, '0') }}</span>
        </a>
        <a href="#contact" class="relative z-10 mt-2 block rounded-2xl bg-bone px-4 py-3.5 text-center text-sm font-medium text-ink" @click="open = false">
          Start a project
        </a>
      </div>
    </div>
  `,
});

/* ================================================================== *
 * components/HeroSection.vue — scroll-scrubbed opening
 * ================================================================== */
export const HeroSection = defineComponent({
  name: "HeroSection",
  components: { AppLogo, SplitHeading, Magnetic },
  setup() {
    const t = ref(0);
    const frame = ref<HTMLElement | null>(null);
    const stage = ref<HTMLElement | null>(null);
    const fit = ref(1);
    /* No reduced-motion branch here on purpose: this scrub is scroll-driven,
       so the user is the one moving it. Under `prefers-reduced-motion` what
       has to stop is autonomous motion (the marquees, handled in CSS), not a
       hero that fades out as it leaves the viewport. */
    onScrollFrame(() => {
      t.value = clamp(window.scrollY / (window.innerHeight * 0.9));
    });
    /* The hero is authored for a portrait screen. In landscape the pinned
       frame is ~375px tall, so rather than let `overflow: hidden` clip the
       CTA row off the bottom, scale the stage down to whatever actually
       fits. Recomputed whenever either box resizes (fonts, rotate, URL bar). */
    const measureFit = () => {
      const f = frame.value, s = stage.value;
      if (!f || !s) return;
      const avail = f.clientHeight - 32; // breathing room above and below
      const natural = s.offsetHeight;
      fit.value = natural > 0 ? Math.min(1, avail / natural) : 1;
    };
    onMounted(() => {
      const ro = new ResizeObserver(measureFit);
      if (frame.value) ro.observe(frame.value);
      if (stage.value) ro.observe(stage.value);
      measureFit();
      onUnmounted(() => ro.disconnect());
    });
    return { t, frame, stage, fit };
  },
  template: `
    <section id="top" class="pin-tall relative">
      <div ref="frame" class="pin-frame sticky top-0 flex items-start justify-center overflow-hidden">
        <div class="pointer-events-none absolute left-1/2 top-[-18rem] h-[46rem] w-[46rem] -translate-x-1/2 rounded-full opacity-40 blur-[130px]"
          style="background: radial-gradient(circle, #c8623c55, transparent 65%)"></div>

        <!-- Background aperture lives in <BackdropLogo /> — single mark, page-wide -->

        <!-- my-auto centres the stage while it fits and top-aligns it when it
             cannot, so the frame never clips the top of the heading. -->
        <div ref="stage" class="hero-stage my-auto w-full"
          :style="fit < 1 ? { transform: 'scale(' + fit + ')' } : {}">
        <div class="relative mx-auto w-full max-w-7xl px-6 lg:px-10"
          :style="{ opacity: 1 - t * 1.05, transform: 'translate3d(0,' + (t * -90) + 'px,0) scale(' + (1 - t * 0.07) + ')' }">
    
        <!-- PORTRAIT: replace public/images/portrait.jpg with your own photo (square works best) -->
          <div class="relative mb-7 inline-block short:mb-3">
            <div class="hero-portrait relative h-20 w-20 overflow-hidden rounded-full border border-white/15 bg-white/5 sm:h-24 sm:w-24">
              <img
                src="images/portrait.jpg"
                alt="John Albert Carbajal"
                class="h-full w-full object-cover object-top"
              />
            </div>
            <!-- measurement ring, part of the tailoring motif -->
            <span class="pointer-events-none absolute -inset-2 rounded-full border border-dashed border-accent/35"></span>
            <span class="pointer-events-none absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent"></span>
          </div>

          <p class="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-bone/45 short:mb-3">
            <span class="h-px bg-accent transition-all duration-1000" style="width:2.5rem"></span>
            John Albert Carbajal — Full Stack Developer
          </p>

          <div class="relative">
            <span class="spec-note absolute -left-16 top-2 hidden lg:block">↕ 01</span>
            <SplitHeading tag="h1" text="Detail oriented."
              class="hero-lead font-serif text-[13.5vw] leading-[0.84] tracking-tight sm:text-[11vw] lg:text-[9rem]" />
            <div class="tick-rule my-3 max-w-[70%] opacity-50 short:my-1"></div>
            <SplitHeading tag="h1" :delay="140" text="*Tailored* to your needs."
              class="hero-tail font-serif text-[9.5vw] leading-[0.9] tracking-tight sm:text-[7.4vw] lg:text-[5.9rem]" />
          </div>

          <div class="mt-12 grid gap-10 border-t border-white/10 pt-9 short:mt-6 short:gap-4 short:pt-5 md:grid-cols-[1.15fr_1fr] md:items-end">
            <p class="max-w-xl text-lg font-light leading-relaxed text-bone/60 short:text-sm">
              I build custom websites and redesign existing ones. Front-end and back-end,
              tailored to what each project actually needs — never a template with a new
              logo on it. Here's what I've built so far.
            </p>
            <div class="flex flex-wrap gap-4 md:justify-end">
              <Magnetic :strength="0.3">
                <a href="#work" class="block min-h-11 rounded-full border border-white/20 px-7 py-3 text-sm transition-colors hover:border-accent hover:text-accent">See my work</a>
              </Magnetic>
              <Magnetic :strength="0.3">
                <a href="#contact" class="block min-h-11 rounded-full bg-accent px-7 py-3 text-sm font-medium text-bone transition hover:opacity-85">Get a quote</a>
              </Magnetic>
            </div>
          </div>
        </div>
        </div>

        <div class="hero-hint pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
          :style="{ opacity: 1 - t * 2 }">
          <span class="text-[10px] uppercase tracking-[0.35em] text-bone/35">Scroll</span>
          <span class="relative block h-12 w-px overflow-hidden bg-white/15">
            <span class="absolute inset-x-0 block h-4 bg-accent"
              :style="{ top: (t * 32) + 'px', opacity: 1 - t }"></span>
          </span>
        </div>
      </div>
    </section>
  `,
});

/* ================================================================== *
 * components/MarqueeStrip.vue
 * ================================================================== */
export const MarqueeStrip = defineComponent({
  name: "MarqueeStrip",
  components: { AppLogo },
  props: { reverse: { type: Boolean, default: false } },
  setup() {
    const words = ["Detail oriented", "Tailored to your needs", "Custom built", "Full stack"];
    return { row: [...words, ...words, ...words, ...words] };
  },
  template: `
    <div class="overflow-hidden border-y border-white/10 py-5">
      <div class="marquee-track flex w-max gap-12 whitespace-nowrap" :class="reverse ? 'rev' : ''">
        <span v-for="(w, i) in row" :key="i" class="flex items-center gap-12 text-sm uppercase tracking-[0.3em] text-bone/30">
          {{ w }} <AppLogo :size="15" tone="#c8623c" />
        </span>
      </div>
    </div>
  `,
});

/* ================================================================== *
 * components/PinnedWork.vue — vertical scroll drives a horizontal rail
 * ================================================================== */
export const PinnedWork = defineComponent({
  name: "PinnedWork",
  components: { ParallaxMedia },
  setup() {
    const section = ref<HTMLElement | null>(null);
    const track = ref<HTMLElement | null>(null);
    const view = ref<HTMLElement | null>(null);
    const p = ref(0);
    /* Diagnostic escape hatch, not a feature: `?nosnap` turns off the rail's
       scroll snapping so the reported mobile-only "the rail won't scroll
       sideways" bug can be tested by hand on a real device. Three rounds of
       headless automation reproduced a working rail every time, so the report
       survives without them. Absent the flag this is a no-op — see the
       `html.no-snap .rail-view` rule in index.css. */
    if (new URLSearchParams(location.search).has("nosnap")) {
      document.documentElement.classList.add("no-snap");
    }
    onScrollFrame(() => {
      const s = section.value, tr = track.value;
      if (!s || !tr) return;
      /* Below `lg` the rail is a native horizontal scroller (see `.rail-view`),
         so there is no vertical travel left to map onto it and the readout
         follows the rail's own scroll instead. */
      if (window.innerWidth < 1024) {
        if (tr.style.transform) tr.style.transform = "";
        const v = view.value;
        const max = v ? v.scrollWidth - v.clientWidth : 0;
        p.value = max > 0 && v ? clamp(v.scrollLeft / max) : 0;
        return;
      }
      const total = s.offsetHeight - window.innerHeight;
      const passed = clamp(-s.getBoundingClientRect().top / total);
      p.value = passed;
      const dist = tr.scrollWidth - window.innerWidth;
      tr.style.transform = `translate3d(${-passed * dist}px,0,0)`;
    }, () => [view.value]);
    const height = computed(() => `${projects.length * 85 + 60}svh`);
    return { section, track, view, p, projects, height };
  },
  template: `
    <section id="work" ref="section" class="pin-rail relative" :style="{ '--pin-h': height }">
      <div class="pin-frame sticky top-0 flex flex-col">
        <!-- my-auto centres the block while it fits the pinned frame and
             top-aligns it when it cannot, so the heading is never clipped
             off the top of the frame. -->
        <div class="my-auto flex flex-col">
        <div class="mx-auto mb-8 flex w-full max-w-7xl flex-col items-start gap-5 px-6 short:mb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 lg:px-10">
          <div>
            <p class="mb-3 text-xs uppercase tracking-[0.3em] text-accent">01 — Selected work</p>
            <h2 class="font-serif text-4xl lg:text-6xl">Things I've built.</h2>
          </div>
          <!-- Below sm the heading needs the whole line — at 320px "Things I've
               built." is 267px of a 272px content box — so the readout takes its
               own full-width row underneath rather than colliding with it. -->
          <div class="flex w-full items-center gap-4 sm:w-auto">
            <span class="tabular text-xs text-bone/40">{{ String(Math.min(projects.length, Math.floor(p * projects.length) + 1)).padStart(2,'0') }} / {{ String(projects.length).padStart(2,'0') }}</span>
            <div class="h-px w-28 bg-white/15">
              <div class="h-full bg-accent transition-none" :style="{ width: (p * 100) + '%' }"></div>
            </div>
          </div>
        </div>

        <div ref="view" class="rail-view no-bar">
        <div ref="track" class="flex w-max gap-6 px-6 lg:gap-10 lg:px-10 lg:will-change-transform">
          <article
            v-for="(proj, i) in projects" :key="proj.title"
            class="rail-card group w-[70vw] shrink-0 sm:w-[60vw] lg:w-[46vw]"
          >
            <ParallaxMedia :src="proj.image" :alt="proj.title" :strength="40" height="h-[38vh] short:h-[24vh] lg:h-[46vh]">
              <span class="absolute left-5 top-5 z-20 rounded-full bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur">{{ proj.kind }}</span>
              <span class="absolute right-5 top-5 z-20 font-serif text-5xl text-bone/25">{{ String(i + 1).padStart(2, '0') }}</span>
            </ParallaxMedia>
            <div class="mt-6 short:mt-3">
              <p class="mb-2 text-[10px] uppercase tracking-[0.3em] text-accent">{{ proj.category }}</p>
              <h3 class="font-serif text-3xl lg:text-4xl">{{ proj.title }}</h3>
              <p class="mt-3 max-w-md text-sm leading-relaxed text-bone/55 short:mt-2 short:line-clamp-2">{{ proj.blurb }}</p>
              <div class="mt-4 flex flex-wrap gap-2 short:mt-2">
                <span v-for="t in proj.tags" :key="t" class="rounded-full border border-white/15 px-3 py-1 text-[11px] text-bone/50">{{ t }}</span>
              </div>
              <div class="mt-5 flex flex-wrap items-center gap-5 short:mt-2">
                <a v-for="lk in proj.links" :key="lk.label" :href="lk.href" target="_blank" rel="noopener"
                  class="group/l -mx-2 -my-3 inline-flex min-h-11 items-center gap-2 px-2 py-3 text-sm text-bone/75 transition-colors hover:text-accent">
                  {{ lk.label }}
                  <span class="transition-transform duration-300 group-hover/l:translate-x-1">↗</span>
                </a>
              </div>
            </div>
          </article>

          <div class="rail-card rail-tail flex w-[70vw] shrink-0 items-center lg:w-[34vw]">
            <div>
              <h3 class="font-serif text-4xl leading-tight">Yours could be<br /><span class="italic text-accent">next.</span></h3>
              <p class="mt-4 max-w-xs text-sm leading-relaxed text-bone/50">Tell me what you need and I'll quote a fixed price.</p>
              <a href="#contact" class="mt-6 inline-block rounded-full bg-bone px-7 py-3 text-sm font-medium text-ink transition hover:bg-accent hover:text-bone">Get in touch →</a>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>
    </section>
  `,
});

/* ================================================================== *
 * components/StudioSection.vue
 * ================================================================== */
export const StudioSection = defineComponent({
  name: "StudioSection",
  components: { SplitHeading, FadeUp, ParallaxMedia, StackSection },
  setup: () => ({ owner }),
  template: `
    <section id="studio" class="border-y border-white/10 bg-white/[0.02]">
      <div class="mx-auto grid max-w-7xl gap-14 px-6 py-28 lg:grid-cols-[1fr_1.05fr] lg:px-10 lg:py-40">
        <div>
          <p class="mb-6 text-xs uppercase tracking-[0.3em] text-bone/40">02 — About</p>
          <SplitHeading text="I design it, then I build all of it."
            class="font-serif text-4xl leading-[1.04] lg:text-6xl" />
          <ParallaxMedia class="mt-12 hidden lg:block"
            src="https://images.pexels.com/photos/4959781/pexels-photo-4959781.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200"
            alt="Desk setup" :strength="60" height="h-[300px]" />
        </div>

        <div class="space-y-6 leading-relaxed text-bone/60">
          <FadeUp><p>
            I'm John Albert Carbajal, a full stack developer. Front-end and back-end,
            so I can take a site from a blank file to something deployed and working
            without handing half of it to someone else.
          </p></FadeUp>
          <FadeUp :delay="100"><p>
            I'm early in my career and I'd rather say that than pretend otherwise.
            What it means for you: you get my full attention, a fair price, and someone
            who cares a lot about getting your project right — because my portfolio
            is built out of it.
          </p></FadeUp>
          <FadeUp :delay="180"><p>
            Everything below is code I wrote. The source is linked where I can share it,
            so you can check rather than take my word for it.
          </p></FadeUp>

          <FadeUp :delay="240">
            <div class="pt-4">
              <StackSection />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  `,
});

/* ================================================================== *
 * components/ProcessStack.vue — sticky stacked cards
 * ================================================================== */
export const ProcessStack = defineComponent({
  name: "ProcessStack",
  components: { SplitHeading },
  setup: () => ({ process }),
  template: `
    <section id="process" class="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
      <p class="mb-6 text-xs uppercase tracking-[0.3em] text-accent">03 — How it runs</p>
        <SplitHeading text="Four phases, priced before you commit." class="mb-20 font-serif text-4xl lg:text-7xl" />

      <div class="space-y-6">
        <div
          v-for="(s, i) in process" :key="s.title"
          class="sticky overflow-hidden rounded-3xl border border-white/10 bg-ink p-8 lg:p-14"
          :style="{ top: (100 + i * 26) + 'px' }"
        >
          <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
            style="background: radial-gradient(circle,#c8623c66,transparent 70%)"></div>
          <div class="relative grid gap-8 lg:grid-cols-[auto_1fr_1fr] lg:items-start lg:gap-16">
            <span class="font-serif text-6xl text-accent lg:text-7xl">{{ s.no }}</span>
            <div>
              <h3 class="font-serif text-3xl lg:text-5xl">{{ s.title }}</h3>
              <p class="mt-2 text-xs uppercase tracking-[0.25em] text-bone/35">{{ s.duration }}</p>
            </div>
            <div>
              <p class="leading-relaxed text-bone/60">{{ s.desc }}</p>
              <ul class="mt-6 space-y-2">
                <li v-for="d in s.deliverables" :key="d" class="flex items-center gap-3 text-sm text-bone/45">
                  <span class="h-px w-5 bg-accent"></span>{{ d }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
});

/* ================================================================== *
 * components/CraftList.vue — hover rows with cursor-following preview
 * ================================================================== */
export const CraftList = defineComponent({
  name: "CraftList",
  components: { SplitHeading },
  setup: () => ({ services }),
  template: `
    <section id="services" class="relative border-y border-white/10 bg-white/[0.02]">
      <div class="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
        <p class="mb-6 text-xs uppercase tracking-[0.3em] text-bone/40">04 — Capabilities</p>
        <SplitHeading text="What I actually do." class="mb-16 font-serif text-4xl lg:text-7xl" />

        <div class="border-t border-white/10">
          <div
            v-for="(s, i) in services" :key="s.title"
            class="group relative flex items-center justify-between gap-6 border-b border-white/10 py-8 transition-all duration-500 lg:py-11"
          >
            <div class="absolute inset-0 origin-left scale-x-0 bg-accent/10 transition-transform duration-[700ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100"></div>
            <div class="relative flex items-baseline gap-6">
              <span class="tabular text-xs text-bone/30">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="font-serif text-3xl transition-colors duration-500 group-hover:text-accent lg:text-5xl">{{ s.title }}</h3>
            </div>
            <p class="relative hidden max-w-sm text-sm leading-relaxed text-bone/45 lg:block">{{ s.desc }}</p>
            <span class="relative text-2xl text-bone/25 transition-all duration-500 group-hover:translate-x-2 group-hover:text-accent">→</span>
          </div>
        </div>
      </div>
    </section>
  `,
});

/* Testimonials removed — no real client quotes to show yet.
   The FAQ section (components/FaqSection) occupies this slot instead. */

/* ================================================================== *
 * components/ContactSection.vue
 * ================================================================== */
export const ContactSection = defineComponent({
  name: "ContactSection",
  components: { SplitHeading, Magnetic, AppLogo },
  setup() {
    const sent = ref(false);
    const socials = [
      { label: "GitHub", href: "https://github.com/AlbertCJC" },
      { label: "LinkedIn", href: "https://linkedin.com/in/AlbertCJC" },
      { label: "Email", href: "mailto:" + owner.email },
    ];
    const fields = [
      { id: "name", label: "Name", type: "text", ph: "Your name", required: true, autocomplete: "name" },
      { id: "email", label: "Email", type: "email", ph: "you@example.com", required: true, autocomplete: "email" },
      { id: "url", label: "Current site (optional)", type: "url", ph: "yoursite.com", required: false, autocomplete: "url" },
    ];
    const t = ref(0);
    onScrollFrame(() => {
      const el = document.getElementById("contact");
      if (!el) return;
      const r = el.getBoundingClientRect();
      t.value = clamp((window.innerHeight - r.top) / window.innerHeight);
    });
    return { sent, socials, fields, t, owner, submit: () => (sent.value = true) };
  },
  template: `
    <section id="contact" class="relative overflow-hidden border-t border-white/10">
      <!-- Background aperture lives in <BackdropLogo /> — single mark, page-wide -->
      <div class="relative mx-auto grid max-w-7xl gap-16 px-6 py-28 lg:grid-cols-2 lg:px-10 lg:py-40">
        <div>
          <p class="mb-6 text-xs uppercase tracking-[0.3em] text-bone/40">05 — Contact</p>
          <SplitHeading text="Tell me what you need." class="font-serif text-5xl leading-[0.98] lg:text-7xl" />
          <p class="mt-8 max-w-md leading-relaxed text-bone/55">
            A new site, a redesign, or you're not sure yet. Send a message and
            I'll reply within a day with questions and a price.
          </p>
          <div class="mt-8 space-y-3 text-bone/60">
            <p><a :href="'mailto:' + owner.email" class="relative -my-2.5 inline-flex min-h-11 items-center px-0 py-2.5 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-accent after:transition-transform hover:text-accent hover:after:origin-left hover:after:scale-x-100">{{ owner.email }}</a></p>
            <p class="text-bone/45">Remote — works anywhere</p>
          </div>
          <div class="mt-10 flex gap-6 text-sm text-bone/45">
            <a v-for="s in socials" :key="s.label" :href="s.href" class="-mx-2 -my-3 inline-flex min-h-11 items-center px-2 py-3 transition-colors hover:text-bone">{{ s.label }}</a>
          </div>
        </div>

        <form class="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-9 backdrop-blur-sm lg:p-11 lg:pb-12" @submit.prevent="submit">
          <div v-for="f in fields" :key="f.id" class="group">
            <label :for="f.id" class="mb-2 block text-[10px] uppercase tracking-[0.25em] text-bone/40">{{ f.label }}</label>
            <input :id="f.id" :name="f.id" :type="f.type" :autocomplete="f.autocomplete" :placeholder="f.ph" :required="f.required"
              class="w-full border-b border-white/15 bg-transparent py-3 text-bone outline-none transition-colors placeholder:text-bone/20 focus:border-accent" />
          </div>
          <div>
            <label for="message" class="mb-2 block text-[10px] uppercase tracking-[0.25em] text-bone/40">What do you need?</label>
            <textarea id="message" name="message" autocomplete="off" rows="4" required placeholder="A few sentences is enough…"
              class="w-full resize-none border-b border-white/15 bg-transparent py-3 text-bone outline-none transition-colors placeholder:text-bone/20 focus:border-accent"></textarea>
          </div>
          <Magnetic :strength="0.15" class="mt-2 block pt-2">
            <button
              type="submit"
              class="block w-full rounded-full bg-bone px-10 py-5 text-[15px] font-medium tracking-wide text-ink transition-colors duration-400 hover:bg-accent hover:text-bone focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {{ sent ? "Thanks — I'll reply within a day ✓" : 'Send message' }}
            </button>
          </Magnetic>
          <p class="mt-1 pb-1 text-center text-[11px] text-bone/30">No obligation. I'll tell you if I'm not the right fit.</p>
        </form>
      </div>
    </section>
  `,
});

/* ================================================================== *
 * components/SiteFooter.vue
 * ================================================================== */
export const SiteFooter = defineComponent({
  name: "SiteFooter",
  components: { AppLogo },
  setup() {
    const time = ref("");
    onMounted(() => {
      const tick = () =>
        (time.value = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Lisbon",
        }).format(new Date()));
      tick();
      const id = setInterval(tick, 1000);
      onUnmounted(() => clearInterval(id));
    });
    return { time };
  },
  template: `
    <footer class="border-t border-white/10">
      <div class="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 text-xs text-bone/35 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <div class="flex items-center gap-3 text-bone/60">
          <AppLogo :size="30" />
          <span class="uppercase tracking-[0.22em]">John Albert Carbajal</span>
        </div>
        <span class="text-bone/50">Detail oriented, tailored specifically for your needs.</span>
        <span class="tabular">{{ time }}</span>
        <span>© 2026 · Built by hand</span>
      </div>
    </footer>
  `,
});
