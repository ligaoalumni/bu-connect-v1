import { Card, CardHeader, CardTitle, CardContent } from "@/components";
import React from "react";
import { PostForm } from "../../__components/post-form";
import { notFound } from "next/navigation";
import { readPostAction } from "@/actions";

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	if (!slug) return notFound();

	const post = await readPostAction(slug);

	if (!post) return notFound();

	return (
		<div className="container mx-auto py-10">
			<Card>
				<CardHeader>
					<CardTitle>Edit Post</CardTitle>
				</CardHeader>
				<CardContent>
					<PostForm
						post={{
							content: post.content,
							slug: post.slug,
							title: post.title,
							images: post.images || [],
						}}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
