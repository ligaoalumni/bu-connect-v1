"use client";
import { Button } from "@/components";
import { useContentData } from "@/contexts/content-context";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

export default function PostButtons({
	slug,
	comments,
	id,
	likes,
	isLiked,
}: {
	slug: string;
	comments: number;
	likes: number;
	isLiked: boolean;
	id: number;
}) {
	const { setData } = useContentData();

	useEffect(() => {
		setData({
			comments,
			id,
			likes,
			isLiked,
		});
	}, [id]);

	return (
		<div className="flex items-center justify-between w-full px-6 py-2 border-y">
			<Button variant="ghost" size="sm" className="flex-1 gap-2">
				<Heart
					className={`h-5 w-5 ${isLiked && "text-[#E8770B] fill-[#E8770B]"}`}
				/>
				{isLiked ? "Unlike" : "Like"}
			</Button>
			<Button asChild variant="ghost" size="sm" className="flex-1 gap-2">
				<Link href={`/posts/${slug}/info#comment-section`}>
					<MessageCircle className="h-4 w-4" />
					Comment
				</Link>
			</Button>
			<Button variant="ghost" size="sm" className="flex-1 gap-2">
				<Share2 className="h-4 w-4" />
				Share
			</Button>
		</div>
	);
}
