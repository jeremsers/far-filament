// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
                @use "/src/assets/style/utils.scss" as *;
              `
        }
      }
    }
  },
  site:"https://www.essence-et-conscience.ch",

  integrations: [sitemap()]
});