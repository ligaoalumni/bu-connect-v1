import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components";
// import { CommentForm } from "./comment-form";
// import { CommentList } from "./comment-list";
import PostImages from "../../__components/post-images";
import { getInformation, readPostAction } from "@/actions";
import CommentSection from "../../__components/comment-section";
import PostCounts from "../../__components/post-counts";
import PostButtons from "../../__components/post-buttons";

export default async function PostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	if (!slug) return notFound();

	const post = await readPostAction(slug);
	const user = await getInformation();

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
					<PostCounts />
				</CardContent>
				<CardFooter className="flex flex-col p-0 w-full">
					<PostButtons
						id={post.id}
						comments={post._count.comments}
						slug={post.slug}
						likes={post._count.likedBy}
						isLiked={post.likedBy.some((u) => u.id === user?.id)}
					/>
					<CommentSection postId={post.id} slug={post.slug} />
				</CardFooter>
			</Card>
		</main>
	);
}
