"use client";

import { likePostAction, unlikePostAction } from "@/actions";
import PostImages from "@/app/(alumni)/posts/__components/post-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts";
import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface MiniPostCardProps {
  likedByIds: number[];
  post: {
    id: number;
    avatar: string;
    name: string;
    content: string;
    batch: number;
    likes_count: number;
    comments_count: number;
    images: string[];
    slug: string;
  };
}

export function MiniPostCard({ post, likedByIds }: MiniPostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(
    !!likedByIds.includes(Number(user?.id)),
  );
  const router = useRouter();
  const [count, setCount] = useState(post.likes_count);
  const [isLoading, setIsLoading] = useState(false);
  const handleLike = async () => {
    // TODO: ADD LIKE
    if (!user) return router.push("/login");

    try {
      setIsLoading(true);
      if (isLiked) {
        setCount((c) => c - 1);
        setIsLiked(false);
        await unlikePostAction({
          postId: post.id,
          slug: post.slug,
        });
      } else {
        setIsLiked(true);
        setCount((c) => c + 1);
        await likePostAction({
          postId: post.id,
          slug: post.slug,
        });
      }
    } catch {
      if (isLiked) {
        setCount((c) => c - 1);
        setIsLiked(false);
      } else {
        setIsLiked(true);
        setCount((c) => c + 1);
      }
      toast.error("Something went wrong", {
        description: "Please try again later.",
        richColors: true,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const hasImages = post.images.length > 0;

  return (
    <Card className="w-full   hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={post.avatar || "/placeholder.svg"}
              alt={post.name}
            />
            <AvatarFallback className="text-[#EC9848]">
              {post.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="space-y-1">
              <h3 className="font-bold text-[#EC9848] capitalize">
                {post.name}
              </h3>
              {!!post.batch && (
                <p className="text-sm text-[#EC9848]">{post.batch}</p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Link href={`/posts/${post.slug}/info`}>
          <p className="text-lg font-semibold text-muted-foreground mb-4 leading-relaxed">
            {post.content}
          </p>

          {hasImages && <PostImages disableModal images={post.images} />}
        </Link>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            disabled={isLoading}
            onClick={handleLike}
            className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Heart
              className={`h-4 w-4 ${
                isLiked && "text-[#E8770B] fill-[#E8770B]"
              }`}
            />
            {!!count && <span className="text-xs">{count}</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            disabled={isLoading}
            className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors"
          >
            <Link href={`/posts/${post.slug}/info`}>
              <MessageCircle className="h-4 w-4" />
              {!!post.comments_count && (
                <span className="text-xs">{post.comments_count}</span>
              )}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
