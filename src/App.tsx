import { useEffect, useRef } from "react";
import { mountNuxtApp } from "./nuxt/app";

/**
 * Vite entry point. The entire portfolio UI is authored in Vue 3
 * (Nuxt-style `components/` + `app.vue` structure under src/nuxt/)
 * and mounted here into the host container.
 */
export default function App() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!host.current) return;
    return mountNuxtApp(host.current);
  }, []);

  return <div ref={host} />;
}
