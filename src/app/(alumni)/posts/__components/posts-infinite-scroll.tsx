"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { readPostsAction } from "@/actions";
import { Button } from "../../../../components/ui/button";
import { Job } from "@prisma/client";
import { TPost } from "@/types";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components";
import { useAuth, useContentData } from "@/contexts";
import { MiniPostCard } from "@/components/custom/mini-post-card";

export function PostsInfiniteScroll({
  defaultData,
  moreData = false,
}: {
  defaultData: TPost[];
  moreData?: boolean;
}) {
  const { posts, setPosts } = useContentData();
  const [filter] = useState<Job["status"] | "all">("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(moreData);
  const [loading, setLoading] = useState(false);
  const [isFilterChanging, setIsFilterChanging] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { user } = useAuth();
  const loadingRef = useRef(false);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 500px 0px",
  });

  const loadMorePosts = async (resetData = false, currentFilter = filter) => {
    // Prevent multiple simultaneous requests
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const currentPage = resetData ? 0 : page;

      const result = await readPostsAction({
        filter: currentFilter,
        pagination: {
          page: currentPage,
          limit: 8,
        },
      });

      if (resetData) {
        setPosts(result.data);
      } else {
        setPosts((prev) => [...prev, ...result.data]);
      }

      setHasMore(result.hasMore);
      setPage(resetData ? 1 : currentPage + 1);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
      setIsFilterChanging(false);
      loadingRef.current = false;
    }
  };

  // Load more when scrolling to the bottom
  useEffect(() => {
    if (
      inView &&
      hasMore &&
      !loading &&
      !isFilterChanging &&
      !loadingRef.current
    ) {
      loadMorePosts();
    }
  }, [inView, hasMore, loading, isFilterChanging]);

  // Handle filter changes
  useEffect(() => {
    if (isFilterChanging) {
      loadMorePosts(true, filter);
    }
  }, [isFilterChanging, filter]);

  useEffect(() => {
    setPosts(defaultData);
  }, [defaultData]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`${!isFilterChanging && "space-y-8"} px-5`}>
      <Link
        href="/posts/add"
        className="mx-auto mt-8 lg:max-w-screen-md flex items-start gap-5 lg:col-span-1 bg-white rounded-md shadow-md p-5 w-full"
      >
        <Avatar className="border border-gray-100">
          <AvatarImage src={user?.avatar || ""} />
          <AvatarFallback className="capitalize">
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <p className="text-gray-500 dark:text-black border w-full border-gray-900/30 rounded-xl p-4">
          What&apos;s on your mind?
        </p>
      </Link>

      <div className="md:max-w-screen-lg md:mx-auto overflow-y-auto max-h-[80vh] scrollbar-hide">
        <div className="space-y-5">
          {posts.map((post) => (
            <div className="mx-auto max-w-screen-md" key={post.id}>
              <MiniPostCard
                postedById={post.postedById}
                post={{
                  images: post.images,
                  id: post.id,
                  avatar: post.postedBy.image || "",
                  name: `${post.postedBy.firstName} ${post.postedBy.lastName}`,
                  batch: post.postedBy.batch || 0,
                  comments_count: post._count.comments,
                  content: post.title,
                  likes_count: post._count.likedBy || post._count.comments,
                  slug: post.slug,
                  createdAt: post.createdAt.toISOString(),
                }}
                likedByIds={post.likedBy.map((i) => i.id) || []}
              />
            </div>
          ))}
        </div>

        {loading && (
          <div className="space-y-5 mt-5">
            {Array.from({ length: 2 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        )}

        {hasMore && !loading && <div ref={ref} className="h-10" />}

        {!hasMore && !loading && posts.length > 0 && (
          <p className="text-center text-muted-foreground py-8">
            You&apos;ve reached the end!
          </p>
        )}

        {!loading && posts.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No posts found.
          </p>
        )}

        {isFilterChanging && <FilterChangeOverlay />}

        {showBackToTop && (
          <Button
            size="icon"
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg transition-all duration-300 z-40"
            aria-label="Back to top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="overflow-hidden mx-auto max-w-screen-md">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </Card>
  );
}

function FilterChangeOverlay() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-lg font-medium">Updating results...</p>
      </div>
    </div>
  );
}
