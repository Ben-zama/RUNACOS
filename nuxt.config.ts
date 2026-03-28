// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  app: {
    head: {
      meta: [{ name: "color-scheme", content: "only light" }],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },

  modules: ["@pinia/nuxt", "@nuxt/fonts", "@vueuse/nuxt"],

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
    plugins: [tailwindcss()],
  },
  
  runtimeConfig: {
    public: {
      apiBase: "https://runacos-api-889007588961.us-central1.run.app",
    },
  },
});
