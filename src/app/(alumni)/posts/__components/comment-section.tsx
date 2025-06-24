"use client";

import { writePostCommentAction } from "@/actions";
import { Button, CommentCard, CommentSkeleton, Separator } from "@/components";
import CommentBox from "@/components/custom/comment-box-input";
import { createBrowserClient } from "@/lib";
import { readPostComments } from "@/repositories";
import { PaginationResult, TPostComment } from "@/types";
import { AlertCircle, MessageSquare, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CommentSection({
  postId,
  slug,
}: {
  postId: number;
  slug: string;
}) {
  const [, setComments] = useState(0);
  const [data, setData] = useState<PaginationResult<TPostComment>>({
    count: 0,
    data: [],
    hasMore: false,
  });
  const [loading, setLoading] = useState({
    initialFetch: true,
    fetchingMore: false,
  });
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 0,
  });
  const [hasError, setHasError] = useState(false);

  const handleFetchMore = async (fetchMore?: boolean) => {
    try {
      setLoading({
        initialFetch: !fetchMore && data.data.length === 0,
        fetchingMore: fetchMore || false,
      });
      setHasError(false);

      const response = await readPostComments({
        postId,
        pagination: fetchMore
          ? { ...pagination, page: pagination.page + 1 }
          : pagination,
      });

      if (fetchMore) {
        setData((prev) => ({
          count: response.count,
          hasMore: response.hasMore,
          data: [...prev.data, ...response.data],
        }));
        setPagination((prev) => ({
          ...prev,
          page: prev.page + 1,
        }));
      } else {
        setComments(response.count);
        setData(response);
      }
    } catch {
      setHasError(true);
      toast.error("Error fetching attendants", {
        description: "Please try again later.",
        richColors: true,
        duration: 5000,
      });
    } finally {
      setLoading({
        initialFetch: false,
        fetchingMore: false,
      });
    }
  };

  const handleRefresh = () => {
    setPagination({
      limit: 10,
      page: 0,
    });
    handleFetchMore();
  };

  useEffect(() => {
    handleFetchMore();
  }, [postId]);

  useEffect(() => {
    const db = createBrowserClient();
    const subscription = db
      .channel("post_comments_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "post_comments",
          filter: `postId=eq.${postId}`,
        },
        async (payload) => {
          if (payload.new) {
            const { data } = await db
              .from("users")
              .select("*")
              .eq("id", payload.new.commentById)
              .single();

            if (data) {
              const newComment = payload.new;

              /*
								comment: "df"
								commentById: -1
								createdAt: "2025-05-06T12:58:34.505"
								id: 4
								postId: 1
							*/
              setData((prev) => ({
                ...prev,
                data: [
                  {
                    id: newComment.id,
                    comment: newComment.comment,
                    name: `${data.firstName} ${data.lastName}`,
                    avatar: data.avatar || "",
                    studentId: String(data.studentId || ""),
                    batch: String(data.batch || ""),
                    commentById: newComment.commentById,
                    postId: newComment.postId,
                    createdAt: new Date(),
                  },
                  ...prev.data,
                ],
              }));
              setComments((prev) => prev + 1);
            }
          }
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleWriteComment(comment: string) {
    try {
      await writePostCommentAction({ comment, slug, postId });
    } catch {
      toast.error("Error writing comment", {
        description: "Please try again later.",
        richColors: true,
        duration: 5000,
      });
    } finally {
      setLoading({ ...loading, initialFetch: false });
    }
  }

  return (
    <div className="p-6 w-full" id="comment-section">
      <h2 className="font-semibold mb-4">Comments</h2>
      <CommentBox onSubmit={handleWriteComment} />
      {/* <CommentList comments={post.comments} /> */}
      <Separator className="my-4" />

      {hasError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 flex flex-col items-center justify-center space-y-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <h3 className="font-semibold text-red-700">
              Error fetching comments
            </h3>
            <p className="text-red-600 mt-1">
              We couldn&apos;t load the comments. Please try again.
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="destructive"
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

      {/* Initial Loading State */}
      {loading.initialFetch && !hasError && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <CommentSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Content State */}
      {!loading.initialFetch && !hasError && (
        <>
          {data.data.length > 0 ? (
            <div className="space-y-3">
              <div className="space-y-3 divide-y divide-gray-100">
                {data.data.map((comment) => {
                  return (
                    <div className="pt-3 first:pt-0" key={comment.id}>
                      <CommentCard
                        comment={comment.comment}
                        commentId={comment.id}
                        name={comment.name}
                        avatar={comment.avatar || ""}
                        timestamp={comment.createdAt}
                        userId={comment.id}
                        batch={Number(comment.batch) || undefined}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Load More Section */}
              {loading.fetchingMore && (
                <div className="pt-2 space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <CommentSkeleton key={`more-${index}`} />
                  ))}
                </div>
              )}

              {data.hasMore && !loading.fetchingMore && (
                <div className="pt-4 flex justify-center">
                  <Button
                    variant="outline"
                    className={`w-full max-w-xs `}
                    disabled={loading.fetchingMore}
                    onClick={() => handleFetchMore(true)}
                  >
                    {loading.fetchingMore ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      "Load More Comments"
                    )}
                  </Button>
                </div>
              )}

              {!data.hasMore && data.data.length > 5 && (
                <p className="text-center text-sm text-muted-foreground pt-2">
                  You&apos;ve reached the end of the list
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 flex flex-col items-center justify-center text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="font-medium">No comments yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Be the first to leave a comment on this event.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
