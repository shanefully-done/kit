import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Kit.",
		short_name: "Kit.",
		description: "A collection of developer tools.",
		start_url: "/",
		display: "standalone",
		background_color: "#f2f1eb",
		theme_color: "#f2f1eb",
		icons: [
			{
				src: "/web-app-manifest-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/web-app-manifest-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
