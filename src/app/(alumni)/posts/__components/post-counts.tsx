"use client";

import { useContentData } from "@/contexts/content-context";

export default function PostCounts() {
	const { data } = useContentData();

	return (
		<div className="flex items-center text-sm text-muted-foreground pt-2">
			<span>{data?.likes || 0} likes</span>
			<span className="mx-2">•</span>
			<span>{data?.comments || 0} comments</span>
		</div>
	);
}
