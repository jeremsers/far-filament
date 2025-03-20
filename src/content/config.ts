import { defineCollection, z } from "astro:content";
import qs from "qs";

const blogCollection = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.date(),
			author: z.string(),
			image: image().optional(),
			category: z.string(),
			tags: z.array(z.string()).optional(),
		}),
});

const eventsCollection = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			date: z.union([z.date(), z.string()]),
			prix: z.string(),
			lieu: z.string(),
			tailleGroupe: z.number(),
			image: image(),
			type: z
				.enum(["atelier", "conference", "retraite", "session"])
				.default("atelier"),
			lien: z.string(),
		}),
});

// Define a custom content collection that loads data from Strapi
const strapiPostsLoader = defineCollection({
	// Async loader function that fetches data from Strapi API
	loader: async () => {
		// Get Strapi URL from environment variables or fallback to localhost
		const BASE_URL = import.meta.env.API;
		const path = "/blogs";
		const url = new URL(path, BASE_URL);

		// Build query parameters using qs to populate cover image data
		url.search = qs.stringify({
			populate: {
				cover: {
					fields: ["url", "alternativeText"],
				},
			},
		});

		// Fetch articles from Strapi
		const blogData = await fetch(url.href);
		const { data } = await blogData.json();

		// Transform the API response into the desired data structure
		return data.map((item) => ({
			id: item.id.toString(),
			title: item.title,
			description: item.description,
			slug: item.slug,
			createdAt: item.createdAt,
			updatedAt: item.updatedAt,
			publishedAt: item.publishedAt,
			cover: {
				id: Number(item.cover.id),
				documentId: item.cover.documentId,
				url: item.cover.url,
				alternativeText: item.cover.alternativeText,
			},
		}));
	},
	// Define the schema for type validation using Zod
	schema: z.object({
		id: z.string(),
		title: z.string(),
		description: z.string(),
		slug: z.string(),
		createdAt: z.string(),
		updatedAt: z.string(),
		publishedAt: z.string(),
		cover: z.object({
			id: z.number(),
			documentId: z.string(),
			url: z.string(),
			alternativeText: z.string(),
		}),
	}),
});

export const collections = {
	blog: blogCollection,
	events: eventsCollection,
};
