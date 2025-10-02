"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { readPostsAction } from "@/actions";
import { Button } from "../../../../components/ui/button";
import { Job } from "@prisma/client";
import { TPost } from "@/types";
import { PostCard } from "./post-card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components";
import { useAuth } from "@/contexts";
import { MiniPostCard } from "@/components/custom/mini-post-card";

export function PostsInfiniteScroll({
  defaultData,
  moreData = false,
}: {
  defaultData: TPost[];
  moreData?: boolean;
}) {
  const [posts, setPosts] = useState<TPost[]>(defaultData || []);
  const [filter] = useState<Job["status"] | "all">("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(moreData);
  const [loading, setLoading] = useState(false);
  const [isFilterChanging, setIsFilterChanging] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { user } = useAuth();

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 500px 0px", // Load more content before user reaches the end
  });

  const loadMorePosts = async (resetData = false, currentFilter = filter) => {
    if (loading) return;

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
    }
  };

  // Load more when scrolling to the bottom
  useEffect(() => {
    if (inView && hasMore && !loading && !isFilterChanging) {
      loadMorePosts();
    }
  }, [inView, hasMore, loading, isFilterChanging, loadMorePosts]); // Added loadMorePosts to dependencies

  // Handle filter changes
  useEffect(() => {
    // Skip the initial render
    if (isFilterChanging) {
      // Reset pagination and load new data with the filter
      loadMorePosts(true, filter);
    }
  }, [isFilterChanging, filter, loadMorePosts]); // Added loadMorePosts to dependencies

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
    <div className={`${!isFilterChanging && "space-y-8"}     px-5 `}>
      <Link
        href="/posts/add"
        className="mx-auto mt-8  lg:max-w-screen-md  flex items-start gap-5 lg:col-span-1 bg-white   rounded-md  shadow-md p-5 w-full"
      >
        <Avatar className="border border-gray-100">
          <AvatarImage src={user?.avatar || ""} />
          <AvatarFallback className="capitalize">
            {user?.firstName.charAt(0)}
            {user?.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <p className="text-gray-500 dark:text-black border w-full border-gray-900/30 rounded-xl p-4">
          What&apos;s on your mind?
        </p>
      </Link>
      {/* <div className="flex flex-col gap-2 md:pt-4 ">
				<div className="flex items-center justify-between">
					<h2 className="text-3xl font-medium">Search</h2>
					<Button asChild variant="secondary">
						<Link href="/posts/manage">Manage my posts</Link>
					</Button>
				</div>
				<div>
					<Label>Status</Label>
					<Select
						disabled={loading}
						value={filter}
						onValueChange={handleFilterChange}>
						<SelectTrigger className="w-full smax-w-[180px]">
							<SelectValue placeholder="Filter Event" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Job Status</SelectLabel>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value="OPEN">Open</SelectItem>
								<SelectItem value="CLOSED">Closed</SelectItem>
								<SelectItem value="COMPLETED">Completed</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				{filter !== "all" && (
					<Button onClick={resetFilter}>Clear Filter</Button>
				)}
			</div> */}

      <div className="  md:max-w-screen-lg md:mx-auto overflow-y-auto max-h-[80vh] scrollbar-hide">
        <div className="space-y-5">
          {posts.map((post, index) => (
            <div
              className="mx-auto max-w-screen-md"
              key={`post-card-container-${post.id}`}
            >
              <MiniPostCard
                post={{
                  images: post.images,
                  id: post.id,
                  avatar: post.postedBy.image || "",
                  name: `${post.postedBy.firstName} ${post.postedBy.lastName}`,
                  batch: post.postedBy.batch || 0,
                  comments_count: post._count.comments,
                  content: post.title,
                  likes_count: post._count.comments,
                  slug: post.slug,
                  createdAt: post.createdAt.toISOString(),
                }}
                likedByIds={post.likedBy.map((i) => i.id) || []}
                key={index}
              />
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Intersection observer target */}
        {hasMore && <div ref={ref} className="h-10" />}

        {/* End message */}
        {!hasMore && !loading && posts.length > 0 && (
          <p className="text-center text-muted-foreground py-8">
            You&apos;ve reached the end!
          </p>
        )}

        {/* No results message */}
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
            className="fixed bottom-8 right-8 p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg transition-all duration-300 animate-in fade-in zoom-in"
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
    <Card className="overflow-hidden">
      <div className="p-4 space-y-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-20 w-full" />
        <div className="flex items-center space-x-4 pt-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    </Card>
  );
}

function FilterChangeOverlay() {
  return (
    <div className="fixed top-0 h-dvh w-dvw inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-lg font-medium">Updating results...</p>
      </div>
    </div>
  );
}
