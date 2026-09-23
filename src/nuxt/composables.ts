import { ref, onMounted, onUnmounted } from "vue/dist/vue.esm-bundler.js";

/* ------------------------------------------------------------------ *
 * A single shared rAF scroll loop — every scroll effect subscribes.
 * ------------------------------------------------------------------ */
type Sub = () => void;
const subs = new Set<Sub>();
let running = false;
let queued = false;

function flush() {
  queued = false;
  subs.forEach((s) => s());
}
function request() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(flush);
}
function start() {
  if (running) return;
  running = true;
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  request();
}

export function onScrollFrame(fn: Sub) {
  onMounted(() => {
    subs.add(fn);
    start();
    fn();
  });
  onUnmounted(() => subs.delete(fn));
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 0 → 1 progress of an element travelling through the viewport. */
export function viewportProgress(el: HTMLElement, pad = 0) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  return clamp((vh - r.top + pad) / (vh + r.height + pad * 2));
}

/** Page-wide scroll progress 0 → 1 */
export function usePageProgress() {
  const progress = ref(0);
  onScrollFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.value = max > 0 ? clamp(window.scrollY / max) : 0;
  });
  return progress;
}

/** Smoothed mouse position for magnetic / cursor effects */
export function usePointer() {
  const x = ref(0);
  const y = ref(0);
  const down = ref(false);
  const move = (e: MouseEvent) => {
    x.value = e.clientX;
    y.value = e.clientY;
  };
  onMounted(() => {
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", () => (down.value = true));
    window.addEventListener("mouseup", () => (down.value = false));
  });
  onUnmounted(() => window.removeEventListener("mousemove", move));
  return { x, y, down };
}
