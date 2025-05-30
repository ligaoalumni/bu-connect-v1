"use client";
import { likePostAction, unlikePostAction } from "@/actions";
import { Button } from "@/components";
import { useContentData } from "@/contexts";
import { Heart, LinkIcon, MessageCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
	const { setData, data } = useContentData();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setData({
			comments,
			id,
			likes,
			isLiked,
		});
	}, [id]);

	const handleCopy = () => {
		navigator.clipboard.writeText(window.location.href);
		toast.info("Link copied to clipboard", {
			description: "You can now share this link with others.",
			duration: 5000,
			position: "bottom-right",
			richColors: true,
		});
	};

	async function handleLike() {
		try {
			setLoading(true);

			if (isLiked) {
				setData((prev) => ({
					comments: prev?.comments || 0,
					id,
					isLiked: false,
					likes: (prev?.likes || 0) - 1,
				}));
				await unlikePostAction({
					postId: id,
					slug,
				});
			} else {
				setData((prev) => ({
					comments: prev?.comments || 0,
					id,
					isLiked: true,
					likes: (prev?.likes || 0) + 1,
				}));
				await likePostAction({
					postId: id,
					slug,
				});
			}
		} catch {
			toast.error(isLiked ? "Failed to unlike" : "Failed to like", {
				description: "Please try again",
				richColors: true,
				position: "top-center",
			});
			if (isLiked) {
				setData((prev) => ({
					comments: prev?.comments || 0,
					id,
					isLiked: true,
					likes: (prev?.likes || 0) + 1,
				}));
			} else {
				setData((prev) => ({
					comments: prev?.comments || 0,
					id,
					isLiked: false,
					likes: (prev?.likes || 0) - 1,
				}));
			}
		} finally {
			//
			setLoading(false);
		}
	}

	return (
		<div className="flex items-center justify-between w-full px-6 py-2 border-y">
			<Button
				disabled={loading}
				variant="ghost"
				onClick={handleLike}
				size="sm"
				className="flex-1 gap-2">
				<Heart
					className={`h-5 w-5 ${
						data?.isLiked && "text-[#E8770B] fill-[#E8770B]"
					}`}
				/>
				{data?.isLiked ? "Unlike" : "Like"}
			</Button>
			<Button asChild variant="ghost" size="sm" className="flex-1 gap-2">
				<Link href={`/posts/${slug}/info#comment-section`}>
					<MessageCircle className="h-4 w-4" />
					Comment
				</Link>
			</Button>
			<Button
				onClick={handleCopy}
				variant="ghost"
				size="sm"
				className="flex-1 gap-2">
				<LinkIcon className="h-4 w-4" />
				Copy Link
			</Button>
		</div>
	);
}
