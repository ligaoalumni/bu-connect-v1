import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Share2 } from "lucide-react";
// import { CommentForm } from "./comment-form";
// import { CommentList } from "./comment-list";
import PostImages from "../../__components/post-images";
import { readPostAction } from "@/actions";

export default async function PostPage({
	params,
}: {
	params: { slug: string };
}) {
	const { slug } = await params;

	if (!slug) return notFound();

	const post = await readPostAction(slug);

	if (!post) return notFound();

	if (!post) {
		notFound();
	}

	const name = `${post.postedBy.firstName} ${post.postedBy.lastName}`;

	return (
		<main className="container max-w-4xl mx-auto py-6">
			<Card className="overflow-hidden">
				<CardHeader className="flex flex-row items-center gap-3 p-6">
					<Avatar className="h-12 w-12">
						{post.postedBy.avatar && (
							<AvatarImage src={post.postedBy.avatar} alt={name} />
						)}
						<AvatarFallback>
							{name
								.split(" ")
								.map((n) => n.charAt(0))
								.join("")}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<div className="font-semibold">{name}</div>
						<p className="text-sm text-muted-foreground">
							{formatDistanceToNow(new Date(post.createdAt), {
								addSuffix: true,
							})}
						</p>
					</div>
				</CardHeader>
				<CardContent className="p-6 pt-0 space-y-4">
					<h1 className="text-2xl font-bold">{post.title}</h1>
					<div className="whitespace-pre-line">{post.content}</div>

					{post.images.length > 0 && <PostImages images={post.images} />}

					<div className="flex items-center text-sm text-muted-foreground pt-2">
						<span>{post._count.likedBy} likes</span>
						<span className="mx-2">•</span>
						<span>{post._count.comments} comments</span>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col p-0">
					<div className="flex items-center justify-between w-full px-6 py-2 border-y">
						<Button variant="ghost" size="sm" className="flex-1 gap-2">
							<Heart className="h-4 w-4" />
							Like
						</Button>
						<Button variant="ghost" size="sm" className="flex-1 gap-2">
							<MessageCircle className="h-4 w-4" />
							Comment
						</Button>
						<Button variant="ghost" size="sm" className="flex-1 gap-2">
							<Share2 className="h-4 w-4" />
							Share
						</Button>
					</div>

					<div className="p-6">
						<h2 className="font-semibold mb-4">Comments</h2>
						{/* <CommentList comments={post.comments} /> */}
						<Separator className="my-4" />
						{/* <CommentForm postId={post.id} /> */}
					</div>
				</CardFooter>
			</Card>
		</main>
	);
}
