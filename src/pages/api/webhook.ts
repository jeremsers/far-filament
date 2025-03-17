export const prerender = false;

import type { APIRoute } from "astro";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
	auth: import.meta.env.GITHUB_TOKEN,
});

export const POST: APIRoute = async ({ request }) => {
	try {
		const payload = await request.json();

		// Verify the webhook signature from Strapi
		const strapiSignature = request.headers.get("secret");
		if (!strapiSignature) {
			return new Response("No secret header received", { status: 401 });
		}
		if (strapiSignature !== import.meta.env.STRAPI_WEBHOOK_SECRET) {
			return new Response("Invalid secret header", { status: 401 });
		}

		// Extract the content from the Strapi payload
		const { entry } = payload;
		if (!entry) {
			return new Response("No entry data", { status: 400 });
		}

		// Create markdown content
		const markdownContent = `---
title: ${entry.title}
pubDate: ${entry.pubDate}
description: ${entry.description}
author: ${entry.author}
category: ${entry.category}
tags: ${entry.tags}
---

${entry.content}
`;

		// Create a new file in the repository
		const response = await octokit.repos.createOrUpdateFileContents({
			owner: import.meta.env.GITHUB_OWNER,
			repo: import.meta.env.GITHUB_REPO,
			path: `src/content/blog/${entry.slug}.md`,
			message: `Add/Update content: ${entry.title}`,
			content: Buffer.from(markdownContent).toString("base64"),
		});

		return new Response(JSON.stringify(response.data), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Webhook error:", error);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
};
