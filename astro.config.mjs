// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
                @use "/src/assets/style/utils.scss" as *;
              `,
                },
            },
        },
    },
    site: "https://www.essence-et-conscience.ch",
    integrations: [sitemap({
        filter: (page) =>
            page !== 'https://www.essence-et-conscience.ch/dl/pack-rupture-j49fd8/' &&
            page !== 'https://www.essence-et-conscience.ch/dl/pack-burnout-s0q81k3/' &&
            page !== 'https://www.essence-et-conscience.ch/merci-pack-rupture/' &&
            page !== 'https://www.essence-et-conscience.ch/merci-pack-burnout/' &&
            page !== 'https://www.essence-et-conscience.ch/merci-rupture/' &&
            page !== 'https://www.essence-et-conscience.ch/merci-burnout/',
    })],
    output: "static",
    adapter: vercel(),
});