"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

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
import PostImages from "./post-images";

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
	const name = `${post.postedBy.firstName} ${post.postedBy.lastName}`;

	console.log(post, "qqq");

	return (
		<>
			<Card className="w-full max-w-2xl mx-auto overflow-hidden">
				<CardHeader className="flex flex-row items-center gap-3 p-4">
					<Avatar className="h-10 w-10">
						<AvatarImage src={post.postedBy.image || ""} alt={name} />
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
					<Link href={`/posts/${post.slug}/info`} className="hover:underline">
						<h3 className="text-lg font-semibold">{post.title}</h3>
					</Link>
					<p className="text-sm">{post.content}</p>

					{hasImages && <PostImages images={post.images} />}
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
		</>
	);
}
