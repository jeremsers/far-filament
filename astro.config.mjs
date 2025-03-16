// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: vercel(),
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
	integrations: [sitemap()],
});
