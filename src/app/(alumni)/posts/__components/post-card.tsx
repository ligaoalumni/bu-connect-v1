"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

import { ImageModal } from "./image-modal";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components";
import { TPost } from "@/types";

export type Post = {
	id: number;
	slug: string;
	title: string;
	content: string;
	images: string[];
	postedBy: {
		id: number;
		firstName: string;
		lastName: string;
		image?: string;
	};
	_count: {
		likedBy: number;
		comments: number;
	};
	createdAt: Date;
};

interface PostCardProps {
	post: TPost;
	// onLike?: (postId: number) => void;
	// onComment?: (postId: number) => void;
}

export function PostCard({ post }: PostCardProps) {
	const hasImages = post.images.length > 0;
	const imageCount = post.images.length;
	const name = `${post.postedBy.firstName} ${post.postedBy.lastName}`;

	// State for image modal
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	const handleImageClick = (index: number) => {
		setSelectedImageIndex(index);
		setModalOpen(true);
	};

	console.log(post, "qqq");

	return (
		<>
			<Card className="w-full max-w-2xl mx-auto overflow-hidden">
				<CardHeader className="flex flex-row items-center gap-3 p-4">
					<Avatar className="h-10 w-10">
						<AvatarImage
							src={post.postedBy.image || "/placeholder.svg"}
							alt={name}
						/>
						<AvatarFallback>
							{post.postedBy.firstName.charAt(0)}
							{post.postedBy.lastName.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<Link
							href={`/profile/${post.postedBy.id}`}
							className="font-semibold hover:underline">
							{name}
						</Link>
						<p className="text-xs text-muted-foreground">
							{formatDistanceToNow(new Date(post.createdAt), {
								addSuffix: true,
							})}
						</p>
					</div>
				</CardHeader>
				<CardContent className="p-4 pt-0 space-y-3">
					<Link href={`/posts/${post.slug}`} className="hover:underline">
						<h3 className="text-lg font-semibold">{post.title}</h3>
					</Link>
					<p className="text-sm">{post.content}</p>

					{hasImages && (
						<div
							className={`grid gap-1 cursor-pointer ${getImageGridClass(
								imageCount
							)}`}>
							{post.images
								.slice(0, imageCount === 5 ? 3 : imageCount)
								.map((image, index) => (
									<div
										key={index}
										className={`relative overflow-hidden rounded-md ${getImageHeightClass(
											imageCount,
											index
										)}`}
										onClick={() => handleImageClick(index)}>
										<Image
											src={image || "/placeholder.svg"}
											alt={`Post image ${index + 1}`}
											fill
											className="object-cover"
										/>
										{imageCount === 5 && index === 2 && (
											<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
												<span className="text-white font-medium text-lg">
													+2 more
												</span>
											</div>
										)}
									</div>
								))}
						</div>
					)}
				</CardContent>
				<CardFooter className="p-4 pt-0 ">
					<div className="w-full space-y-2">
						<div className="flex items-center justify-between text-sm text-muted-foreground">
							<div>{`${post._count.likedBy || 0} likes`}</div>
							<div>{`${post._count.comments || 0} comments`}</div>
						</div>
						{/* <div className="flex items-center justify-between border-t pt-2">
						<Button
							variant="ghost"
							size="sm"
							className="flex-1 gap-2"
							onClick={() => onLike?.(post.id)}>
							<Heart className="h-4 w-4" />
							Like
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="flex-1 gap-2"
							onClick={() => onComment?.(post.id)}>
							<MessageCircle className="h-4 w-4" />
							Comment
						</Button>
					</div> */}
					</div>
				</CardFooter>
			</Card>

			{/* Image Modal */}
			<ImageModal
				images={post.images}
				initialIndex={selectedImageIndex}
				open={modalOpen}
				onOpenChange={setModalOpen}
			/>
		</>
	);
}

// Helper functions for image grid layout
function getImageGridClass(count: number): string {
	switch (count) {
		case 1:
			return "grid-cols-1";
		case 2:
			return "grid-cols-2";
		case 3:
			return "grid-cols-2";
		case 4:
			return "grid-cols-2";
		case 5:
			return "grid-cols-3";
		default:
			return "grid-cols-1";
	}
}

function getImageHeightClass(count: number, index: number): string {
	// Special case for 3 images (2x2 grid with first image taking full width)
	if (count === 3 && index === 0) {
		return "col-span-2 aspect-[2/1]";
	}

	// For 5 images, we're only showing 3, with a different layout
	if (count === 5) {
		if (index === 0) {
			return "aspect-square";
		} else {
			return "aspect-square";
		}
	}

	// Default heights
	switch (count) {
		case 1:
			return "aspect-[16/9]";
		case 2:
			return "aspect-square";
		case 3:
		case 4:
			return "aspect-square";
		default:
			return "aspect-square";
	}
}
