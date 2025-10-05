import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  LoaderComponent,
} from "@/components";
import React from "react";
import { notFound } from "next/navigation";
import { readPostAction } from "@/actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import dynamic from "next/dynamic";

const PostForm = dynamic(
  () =>
    import("@/app/(alumni)/posts/__components/post-form").then(
      (mod) => mod.PostForm,
    ),
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
    <div className="container mx-auto py-10 px-5 md:px-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-start gap-5">
            <Button asChild variant="default" size="icon">
              <Link href="/my-posts">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <ChevronLeft />
                    </TooltipTrigger>
                    <TooltipContent>Back to my posts</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>
            </Button>
            <CardTitle>Edit Post</CardTitle>
          </div>
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
