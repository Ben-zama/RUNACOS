// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  app: {
    head: {
      meta: [{ name: "color-scheme", content: "only light" }],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },

  modules: [
    "@pinia/nuxt",
    "@nuxt/fonts",
    "@vueuse/nuxt",
    '@primevue/nuxt-module'
  ],

  primevue: {
        options: {
            theme: {
                preset: Aura
            }
        }
    },

  css: ["~/assets/scss/main.scss", "~/assets/css/main.css"],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@use "~/assets/scss/_variables.scss" as *; @use "~/assets/scss/_mixins.scss" as *;',
        },
      },
    },
    optimizeDeps: {
      include: ["lenis", "vue3-marquee"],
    },
    plugins: [tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: "https://runacos-api-889007588961.us-central1.run.app",
          changeOrigin: true, // This fixes the Cloud Run Host header issue
          rewrite: (path) => path.replace(/^\/api/, ""), // Strips /api before sending to backend
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      apiBase: "/api",
      /* apiBase: "https://runacos-api-889007588961.us-central1.run.app", */
    },
  },
});
