import { defineComponent, ref } from "vue/dist/vue.esm-bundler.js";
import { SplitHeading } from "./primitives";
import { faqs, stack } from "../data";

/* ================================================================== *
 * components/FaqSection.vue — replaces fabricated testimonials
 * ================================================================== */
export const FaqSection = defineComponent({
  name: "FaqSection",
  components: { SplitHeading },
  setup() {
    const open = ref(0);
    const toggle = (i: number) => (open.value = open.value === i ? -1 : i);
    return { faqs, open, toggle };
  },
  template: `
    <section id="faq" class="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
      <div class="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p class="mb-6 text-xs uppercase tracking-[0.3em] text-accent">Questions</p>
          <SplitHeading text="The ones people actually ask." class="font-serif text-4xl leading-[1.05] lg:text-5xl" />
          <p class="mt-6 max-w-sm text-sm leading-relaxed text-bone/45">
            Anything not covered here, email me and I will answer it straight.
          </p>
        </div>

        <div class="border-t border-white/10">
          <div v-for="(f, i) in faqs" :key="f.q" class="border-b border-white/10">
            <button
              class="flex w-full items-center justify-between gap-6 py-6 text-left"
              :aria-expanded="open === i"
              @click="toggle(i)"
            >
              <span class="font-serif text-xl transition-colors duration-300 lg:text-2xl"
                :class="open === i ? 'text-accent' : 'text-bone'">{{ f.q }}</span>
              <span class="relative grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors duration-300"
                :class="open === i ? 'border-accent text-accent' : 'border-white/20 text-bone/50'">
                <span class="absolute h-px w-3 bg-current"></span>
                <span class="absolute h-px w-3 bg-current transition-transform duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)]"
                  :style="{ transform: open === i ? 'rotate(0deg)' : 'rotate(90deg)' }"></span>
              </span>
            </button>
            <div class="grid transition-all duration-[550ms] ease-[cubic-bezier(.16,1,.3,1)]"
              :style="{ gridTemplateRows: open === i ? '1fr' : '0fr', opacity: open === i ? 1 : 0 }">
              <div class="overflow-hidden">
                <p class="max-w-2xl pb-7 pr-10 leading-relaxed text-bone/55">{{ f.a }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
});

/* ================================================================== *
 * components/StackSection.vue — replaces invented career stats
 * ================================================================== */
export const StackSection = defineComponent({
  name: "StackSection",
  setup: () => ({ stack }),
  template: `
    <div class="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
      <div v-for="g in stack" :key="g.group" class="bg-ink p-6">
        <div class="spec-note mb-4">{{ g.group }}</div>
        <div class="flex flex-wrap gap-2">
          <span v-for="it in g.items" :key="it"
            class="rounded-full border border-white/12 px-3 py-1.5 text-[13px] text-bone/65 transition-colors duration-300 hover:border-accent hover:text-accent">
            {{ it }}
          </span>
        </div>
      </div>
    </div>
  `,
});
