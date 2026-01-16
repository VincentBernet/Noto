import { createFileRoute } from "@tanstack/react-router";

type TranscriptResponse = {
	transcript: string;
	metadata?: {
		video_title?: string;
		duration?: number;
	};
};

export const Route = createFileRoute("/api/transcript")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);
				const videoUrl = url.searchParams.get("video_url");

				if (!videoUrl) {
					return new Response(
						JSON.stringify({
							error: "video_url parameter is required",
							source: "tanstack-backend",
							route: "/api/transcript",
						}),
						{ status: 400, headers: { "Content-Type": "application/json" } },
					);
				}

				const apiKey = process.env.TRANSCRIPT_API_KEY;
				if (!apiKey) {
					console.error("[TanStack Backend] ❌ TRANSCRIPT_API_KEY not configured", {
						route: "/api/transcript",
						method: "GET",
					});
					return new Response(
						JSON.stringify({
							error: "Transcript API not configured",
							source: "tanstack-backend",
							route: "/api/transcript",
						}),
						{ status: 500, headers: { "Content-Type": "application/json" } },
					);
				}

				try {
					const response = await fetch(
						`https://transcriptapi.com/api/v2/youtube/transcript?video_url=${encodeURIComponent(videoUrl)}`,
						{
							method: "GET",
							headers: {
								Authorization: `Bearer ${apiKey}`,
							},
						},
					);

					if (!response.ok) {
						const errorText = await response.text();
						console.error("[TanStack Backend] ❌ TranscriptAPI error:", {
							status: response.status,
							errorText,
							route: "/api/transcript",
							method: "GET",
						});
						return new Response(
							JSON.stringify({
								error: `Failed to fetch transcript: ${response.statusText}`,
								source: "tanstack-backend",
								route: "/api/transcript",
								details: errorText,
							}),
							{
								status: response.status,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					const data: TranscriptResponse = await response.json();
					return new Response(JSON.stringify(data), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("[TanStack Backend] ❌ Failed to fetch transcript:", {
						error,
						route: "/api/transcript",
						method: "GET",
					});
					if (error instanceof Error) {
						console.error(
							"[TanStack Backend] Error details:",
							error.message,
							error.stack,
						);
					}
					return new Response(
						JSON.stringify({
							error: "Failed to fetch transcript",
							source: "tanstack-backend",
							route: "/api/transcript",
							details: error instanceof Error ? error.message : "Unknown error",
						}),
						{ status: 500, headers: { "Content-Type": "application/json" } },
					);
				}
			},
		},
	},
});
