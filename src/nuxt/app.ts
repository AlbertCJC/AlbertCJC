import { createApp, defineComponent } from "vue/dist/vue.esm-bundler.js";
import {
  BackdropLogo,
  CustomCursor,
  ScrollHud,
  SiteNav,
  HeroSection,
  MarqueeStrip,
  PinnedWork,
  StudioSection,
  ProcessStack,
  CraftList,
  ContactSection,
  SiteFooter,
} from "./components";
import { PromiseBand, FitSelector, TenetGrid } from "./tailored";
import { FaqSection } from "./faq";

/* layouts/default.vue + app.vue equivalent */
const NuxtApp = defineComponent({
  name: "NuxtApp",
  components: {
    BackdropLogo,
    CustomCursor,
    ScrollHud,
    SiteNav,
    HeroSection,
    MarqueeStrip,
    PinnedWork,
    StudioSection,
    ProcessStack,
    CraftList,
    ContactSection,
    SiteFooter,
    PromiseBand,
    FitSelector,
    TenetGrid,
    FaqSection,
  },
  template: `
    <div class="grain relative min-h-screen bg-ink">
      <BackdropLogo />
      <CustomCursor />
      <ScrollHud />
      <SiteNav />
      <main class="relative z-10">
        <HeroSection />
        <MarqueeStrip />
        <PromiseBand />
        <PinnedWork />
        <TenetGrid />
        <StudioSection />
        <FitSelector />
        <ProcessStack />
        <MarqueeStrip :reverse="true" />
        <CraftList />
        <FaqSection />
        <ContactSection />
      </main>
      <div class="relative z-10"><SiteFooter /></div>
    </div>
  `,
});

export function mountNuxtApp(el: HTMLElement) {
  const app = createApp(NuxtApp);
  app.mount(el);
  return () => app.unmount();
}
