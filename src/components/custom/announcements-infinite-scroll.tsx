"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { readAnnouncementsAction } from "@/actions";
import { Button } from "../ui/button";
import { Announcement, User } from "@prisma/client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Image from "next/image";
import { useAuth } from "@/contexts";
import dynamic from "next/dynamic";
import { LoaderComponent } from "./loader";
const RichTextEditor = dynamic(
  () => import("@/components").then((mod) => mod.RichTextEditor),
  { loading: LoaderComponent },
);

export function AnnouncementsInfiniteScroll({
  defaultData,
  moreData = false,
  userId,
}: {
  defaultData: Array<Announcement & { createdBy: User }>;
  moreData?: boolean;
  userId?: number;
}) {
  const [announcements, setAnnouncements] = useState<
    Array<
      Announcement & {
        createdBy: User;
      }
    >
  >(defaultData || []);
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(moreData);
  const [loading, setLoading] = useState(false);
  const [isFilterChanging, setIsFilterChanging] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 500px 0px", // Load more content before user reaches the end
  });

  const loadMorePosts = async (resetData = false, currentFilter = filter) => {
    if (loading) return;

    setLoading(true);

    try {
      const currentPage = resetData ? 0 : page;

      const result = await readAnnouncementsAction({
        pagination: {
          page: currentPage,
          limit: 8,
        },
        id: userId,
        filter: currentFilter === "POPULAR" ? "POPULAR" : undefined,
        order:
          currentFilter === "POPULAR"
            ? undefined
            : currentFilter === "OLDER"
              ? "asc"
              : "desc",
        orderBy:
          currentFilter === "POPULAR"
            ? undefined
            : currentFilter === "all" || currentFilter === "LATEST"
              ? "createdAt"
              : undefined,
        // type: jobType === "all" ? undefined : jobType,
        // status: currentFilter === "all" ? undefined : [currentFilter],
      });

      if (resetData) {
        setAnnouncements(result.data);
      } else {
        setAnnouncements((prev) => [...prev, ...result.data]);
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

  const handleFilterChange = (value: string) => {
    if (value === filter) return;

    setIsFilterChanging(true);
    setFilter(value);

    // Reset to initial state for the new filter
    setPage(0);
    setHasMore(true);

    if (value === "all") {
      // For "all" filter, we can immediately set the default data
      setAnnouncements(defaultData);
      setPage(1);
      setHasMore(moreData);
      setIsFilterChanging(false);
    }
  };

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
    <div className={`${!isFilterChanging && "space-y-8"}    `}>
      <div className="md:col-span-4 md:max-w-screen-lg md:mx-auto overflow-y-auto max-h-[80vh] scrollbar-hide">
        <div className="flex items-center justify-between my-2">
          <h1 className="text-3xl font-medium">Announcements</h1>
          <div className="flex gap-2 items-center">
            <div className="flex gap-2 items-center">
              <Label className="text-lg">Filter</Label>
              <Select
                disabled={loading}
                value={filter}
                onValueChange={handleFilterChange}
              >
                <SelectTrigger className="w-full smax-w-[180px]">
                  <SelectValue placeholder="Filter Event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Filter</SelectLabel>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="POPULAR">Popular</SelectItem>
                    <SelectItem value="LATEST">Latest</SelectItem>
                    <SelectItem value="OLDER">Older</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {user && user.role === "ALUMNI" && (
              <Button asChild>
                <Link href="/announcements/list">Manage Announcements</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-5">
          {announcements.map((announcement, index) => (
            <Card
              key={index}
              className="overflow-hidden bg-white	 shadow-none border-none hover:shadow-sm transition-shadow duration-300 ease-in-out"
            >
              <CardHeader>
                <div className="flex justify-between items-center space-x-4 p-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {announcement.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(announcement.createdAt))}{" "}
                      ago
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <p className="text-gray-600">
                      Posted by:{" "}
                      <span className="font-bold">
                        {announcement.createdBy.role === "ALUMNI" ? (
                          <Link
                            href={`/batch/${announcement.createdBy.batch}/alumni`}
                          >
                            {announcement.createdBy.firstName}{" "}
                            {announcement.createdBy.lastName}
                          </Link>
                        ) : (
                          "Admin"
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-hidden max-h-[300px] mt-0 pt-0 relative">
                <div className="relative aspect-video w-full">
                  <Image
                    src={announcement?.image || `/images/placeholder.jpg`}
                    alt={announcement.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <RichTextEditor content={announcement.content} />
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 backdrop-blur-md bg-opacity-10 rounded-t-md">
                  <div className="flex w-full items-center justify-center space-x-4">
                    <Button asChild className="mx-auto">
                      <Link href={`/announcements/${announcement.slug}`}>
                        View Announcement
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
        {!hasMore && !loading && announcements.length > 0 && (
          <p className="text-center text-muted-foreground py-8">
            You&apos;ve reached the end!
          </p>
        )}

        {/* No results message */}
        {!loading && announcements.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No announcements found.
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
