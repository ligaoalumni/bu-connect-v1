import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				hostname: "nkmkpzzqjrewuynxaftt.supabase.co",
				pathname: "/storage/**",
				protocol: "https",
				port: "",
				search: "",
			},
		],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
	redirects: async () => {
		return [
			{
				source: "/events/:slug",
				destination: "/events/:slug/info",
				has: [
					{
						type: "query",
						key: "slug",
					},
				],
				permanent: false, // Set to true for a permanent redirect (301), false for temporary (302)
			},
		];
	},
};

export default nextConfig;
