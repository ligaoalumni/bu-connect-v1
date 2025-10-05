import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  LoaderComponent,
} from "@/components";
import React from "react";
import { notFound } from "next/navigation";
import { readPostAction } from "@/actions";
import dynamic from "next/dynamic";

const PostForm = dynamic(
  () => import("../../__components/post-form").then((mod) => mod.PostForm),
  {
    loading: LoaderComponent,
  },
);

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
