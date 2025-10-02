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
} from "@/components";
import React from "react";
import { notFound } from "next/navigation";
import { readPostAction } from "@/actions";
import { PostForm } from "@/app/(alumni)/posts/__components/post-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

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
