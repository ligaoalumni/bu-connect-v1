"use client";

import {
  deleteMyPostAction,
  likePostAction,
  unlikePostAction,
} from "@/actions";
import PostImages from "@/app/(alumni)/posts/__components/post-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts";
import { formatDistanceToNow } from "date-fns";
import {
  EllipsisVertical,
  Heart,
  MessageCircle,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DeleteModal } from "@/app/admin/_components/delete-modal";

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
    createdAt: string;
  };
  postedById: number;
}

export function MiniPostCard({
  post,
  likedByIds,
  postedById,
}: MiniPostCardProps) {
  const [toDelete, setToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(
    !!likedByIds.includes(Number(user?.id)),
  );
  const router = useRouter();
  const [count, setCount] = useState(post.likes_count);
  const [isPending, startTransition] = useTransition();

  const handleLike = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const previousLiked = isLiked;
    const previousCount = count;

    // Optimistic update
    if (isLiked) {
      setCount((c) => c - 1);
      setIsLiked(false);
    } else {
      setIsLiked(true);
      setCount((c) => c + 1);
    }

    try {
      if (previousLiked) {
        startTransition(async () => {
          await unlikePostAction({
            postId: post.id,
            slug: post.slug,
          });
        });
      } else {
        startTransition(async () => {
          await likePostAction({
            postId: post.id,
            slug: post.slug,
          });
        });
      }
    } catch (error) {
      // Revert on error
      setIsLiked(previousLiked);
      setCount(previousCount);

      toast.error("Something went wrong", {
        description: (error as Error)?.message || "Please try again later.",
        richColors: true,
        position: "top-center",
      });
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;

    setDeleting(true);

    try {
      startTransition(async () => {
        await deleteMyPostAction(toDelete);
      });

      window.location.reload();
      // setPosts((prevPosts) => prevPosts.filter((p) => p.id !== toDelete));
      // Close modal first
      setToDelete(null);
      toast.success("Post deleted", {
        description: "Your post has been deleted successfully.",
        richColors: true,
        duration: 3000,
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed to delete post", {
        description: (error as Error).message || "Something went wrong!",
        richColors: true,
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setDeleting(false);
    }
  };

  const hasImages = post.images.length > 0;

  return (
    <>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
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
                <div className="space-y-0.5">
                  <h3 className="font-bold leading-none text-[#EC9848] capitalize">
                    {post.name}
                  </h3>
                  {!!post.batch && (
                    <p className="text-sm leading-none text-[#EC9848]">
                      {post.batch}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              {postedById === user?.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild disabled={deleting}>
                    <Button variant="ghost" size="icon" disabled={deleting}>
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>Post Options</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/my-posts/${post.slug}/edit`}
                          className="flex items-center gap-1 justify-start cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          setToDelete(post.id);
                        }}
                        className="text-destructive cursor-pointer gap-1"
                      >
                        <Trash className="w-4 h-4  " />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
          <span className="text-xs text-black/60">
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })}
          </span>
          <div className="flex items-center gap-4 mt-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={isPending || deleting}
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
              disabled={isPending || deleting}
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

      {toDelete !== null && (
        <DeleteModal
          title="Delete post"
          deleteBTNTitle="Confirm"
          loading={deleting}
          description="Are you sure you want to delete this post? This action cannot be undone."
          id={toDelete}
          onClose={() => {
            if (!deleting) {
              setToDelete(null);
            }
          }}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
