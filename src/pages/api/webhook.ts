import type { APIRoute } from "astro";
import fs from "fs/promises";
import path from "path";

interface StrapiImage {
	url: string;
	// Add other image properties if needed
}

interface BlogPost {
	title: string;
	description: string;
	content: string;
	pubDate: string;
	author: string;
	image: StrapiImage;
	category: {
		data: {
			attributes: {
				name: string;
			};
		};
	};
	slug: string;
	Tags: string[];
}

interface Event {
	title: string;
	content: string;
	date: string;
	price: string;
	location: string;
	groupSize: number;
	type: "Atelier" | "Conférence" | "Retraite";
	bookingLink: string;
	slug: string;
	image: StrapiImage;
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
	image: StrapiImage | undefined,
	type: string,
	slug: string
): Promise<string | undefined> {
	if (!image?.url) return undefined;

	try {
		const imageExtension = path.extname(new URL(image.url).pathname) || ".jpg";
		const imageName = `${slug}${imageExtension}`;
		const imageDir = path.join(process.cwd(), "src", "content", type, "img");
		const imagePath = path.join(imageDir, imageName);

		await downloadImage(image.url, imagePath);

		// Return the relative path for the frontmatter
		return `./img/${imageName}`;
	} catch (error) {
		console.error("Error processing image:", error);
		return undefined;
	}
}

const convertBlogToMarkdown = async (post: BlogPost): Promise<string> => {
	const imageRelativePath = await processImage(post.image, "blog", post.slug);

	const frontmatter = `---
title: "${post.title}"
description: "${post.description}"
pubDate: ${post.pubDate}
author: "${post.author}"
image: "${imageRelativePath || ""}"
category: "${post.category.data.attributes.name}"
tags: ${JSON.stringify(post.Tags || [])}
---

${post.content}`;

	return frontmatter;
};

const convertEventToMarkdown = async (event: Event): Promise<string> => {
	const imageRelativePath = await processImage(
		event.image,
		"events",
		event.slug
	);

	// Convert type to lowercase for consistency with existing files
	const eventType = event.type.toLowerCase();

	const frontmatter = `---
title: "${event.title}"
date: ${event.date}
prix: "${event.price}"
lieu: "${event.location}"
tailleGroupe: ${event.groupSize}
image: "${imageRelativePath || ""}"
type: "${eventType}"
lien: '${event.bookingLink}'
---

${event.content}`;

	return frontmatter;
};

export const POST: APIRoute = async ({ request }) => {
	try {
		const data = await request.json();
		const { type, content } = data;

		if (!type || !content) {
			return new Response(JSON.stringify({ error: "Missing type or content" }), {
				status: 400,
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
				`${content.slug}.md`
			);
		} else if (type === "event") {
			markdownContent = await convertEventToMarkdown(content as Event);
			filePath = path.join(
				process.cwd(),
				"src",
				"content",
				"events",
				`${content.slug}.md`
			);
		} else {
			return new Response(JSON.stringify({ error: "Invalid content type" }), {
				status: 400,
			});
		}

		await fs.writeFile(filePath, markdownContent, "utf-8");

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
		});
	} catch (error) {
		console.error("Error processing webhook:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
		});
	}
};
