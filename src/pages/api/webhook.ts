import type { APIContext } from "astro";
import fs from "fs/promises";
import path from "path";

interface StrapiImage {
	url: string;
	// Add other image properties if needed
}

interface BlogPost {
	attributes: {
		title: string;
		description: string;
		content: string;
		pubDate: string;
		author: string;
		image: {
			data: {
				attributes: StrapiImage;
			};
		};
		category: {
			data: {
				attributes: {
					name: string;
				};
			};
		};
		slug: string;
		Tags: string[];
	};
}

interface Event {
	attributes: {
		title: string;
		content: string;
		date: string;
		price: string;
		location: string;
		groupSize: number;
		type: "Atelier" | "Conférence" | "Retraite";
		bookingLink: string;
		slug: string;
		image: {
			data: {
				attributes: StrapiImage;
			};
		};
	};
}

async function downloadImage(
	imageUrl: string | undefined,
	destinationPath: string
): Promise<void> {
	if (!imageUrl) return;

	try {
		const response = await fetch(imageUrl);
		if (!response.ok)
			throw new Error(`Failed to fetch image: ${response.statusText}`);

		const arrayBuffer = await response.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);

		// Ensure the directory exists
		await fs.mkdir(path.dirname(destinationPath), { recursive: true });
		await fs.writeFile(destinationPath, uint8Array);
	} catch (error) {
		console.error("Error downloading image:", error);
		throw error;
	}
}

async function processImage(
	image: { data: { attributes: StrapiImage } } | undefined,
	type: string,
	slug: string
): Promise<string | undefined> {
	if (!image?.data?.attributes?.url) return undefined;

	try {
		const imageUrl = image.data.attributes.url;
		const imageExtension = path.extname(new URL(imageUrl).pathname) || ".jpg";
		const imageName = `${slug}${imageExtension}`;
		const imageDir = path.join(process.cwd(), "src", "content", type, "img");
		const imagePath = path.join(imageDir, imageName);

		await downloadImage(imageUrl, imagePath);

		// Return the relative path for the frontmatter
		return `./img/${imageName}`;
	} catch (error) {
		console.error("Error processing image:", error);
		return undefined;
	}
}

const convertBlogToMarkdown = async (post: BlogPost): Promise<string> => {
	const imageRelativePath = await processImage(
		post.attributes.image,
		"blog",
		post.attributes.slug
	);

	const frontmatter = `---
title: "${post.attributes.title}"
description: "${post.attributes.description}"
pubDate: ${post.attributes.pubDate}
author: "${post.attributes.author}"
image: "${imageRelativePath || ""}"
category: "${post.attributes.category?.data?.attributes?.name || ""}"
tags: ${JSON.stringify(post.attributes.Tags || [])}
---

${post.attributes.content}`;

	return frontmatter;
};

const convertEventToMarkdown = async (event: Event): Promise<string> => {
	const imageRelativePath = await processImage(
		event.attributes.image,
		"events",
		event.attributes.slug
	);

	// Convert type to lowercase for consistency with existing files
	const eventType = event.attributes.type.toLowerCase();

	const frontmatter = `---
title: "${event.attributes.title}"
date: ${event.attributes.date}
prix: "${event.attributes.price}"
lieu: "${event.attributes.location}"
tailleGroupe: ${event.attributes.groupSize}
image: "${imageRelativePath || ""}"
type: "${eventType}"
lien: '${event.attributes.bookingLink}'
---

${event.attributes.content}`;

	return frontmatter;
};

export async function POST({ request }: APIContext) {
	// Add CORS headers
	const headers = new Headers({
		"Access-Control-Allow-Origin": "https://far-filament-back.vercel.app",
		"Access-Control-Allow-Methods": "POST",
		"Access-Control-Allow-Headers": "Content-Type",
	});

	try {
		const data = await request.json();
		const { type, content } = data;

		if (!type || !content) {
			return new Response(JSON.stringify({ error: "Missing type or content" }), {
				status: 400,
				headers,
			});
		}

		let markdownContent: string;
		let filePath: string;

		if (type === "blog") {
			markdownContent = await convertBlogToMarkdown(content as BlogPost);
			filePath = path.join(
				process.cwd(),
				"src",
				"content",
				"blog",
				`${content.attributes.slug}.md`
			);
		} else if (type === "event") {
			markdownContent = await convertEventToMarkdown(content as Event);
			filePath = path.join(
				process.cwd(),
				"src",
				"content",
				"events",
				`${content.attributes.slug}.md`
			);
		} else {
			return new Response(JSON.stringify({ error: "Invalid content type" }), {
				status: 400,
				headers,
			});
		}

		await fs.writeFile(filePath, markdownContent, "utf-8");

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers,
		});
	} catch (error) {
		console.error("Error processing webhook:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers,
		});
	}
}

// Handle preflight requests
export function OPTIONS() {
	return new Response(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Origin": "https://far-filament-back.vercel.app",
			"Access-Control-Allow-Methods": "POST",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	});
}
