"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { readJobsAction } from "@/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Job } from "@prisma/client";
import { Badge } from "../ui/badge";
import { JobStatusBadgeColorMap } from "@/constant";
import Link from "next/link";
import { Label } from "../ui/label";
import { useAuth } from "@/contexts";

export function JobsInfiniteScroll({
  defaultData,
  moreData = false,
}: {
  defaultData: Job[];
  moreData?: boolean;
}) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(defaultData || []);
  const [filter, setFilter] = useState<Job["status"] | "all">("all");
  const [jobType, setJobType] = useState<Job["type"] | "all">("all");
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

      const result = await readJobsAction({
        pagination: {
          page: currentPage,
          limit: 8,
        },
        type: jobType === "all" ? undefined : jobType,
        status: currentFilter === "all" ? undefined : [currentFilter],
      });

      if (resetData) {
        setJobs(result.data);
      } else {
        setJobs((prev) => [...prev, ...result.data]);
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
  }, [isFilterChanging, filter, loadMorePosts, jobType]); // Added loadMorePosts to dependencies

  const handleFilterChange = (value: string) => {
    if (value === filter) return;

    setIsFilterChanging(true);
    setFilter(value as Job["status"]);

    // Reset to initial state for the new filter
    setPage(0);
    setHasMore(true);

    if (value === "all") {
      // For "all" filter, we can immediately set the default data
      setJobs(defaultData);
      setPage(1);
      setHasMore(moreData);
      setIsFilterChanging(false);
    }
  };

  const handleTypeFilterChange = (value: string) => {
    if (value === jobType) return;

    setIsFilterChanging(true);
    setJobType(value as Job["type"]);

    // Reset to initial state for the new filter
    setPage(0);
    setHasMore(true);

    if (value === "all") {
      // For "all" filter, we can immediately set the default data
      setJobs(defaultData);
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

  const resetFilter = () => {
    setIsFilterChanging(true);
    setJobType("all");
    setFilter("all");
  };

  return (
    <div
      className={`${
        !isFilterChanging && "space-y-8"
      } grid grid-cols-1 md:grid-cols-5 gap-5 md:gap-10  `}
    >
      <div className="flex flex-col gap-2 md:pt-4 ">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-medium">Search</h2>
          {user && (
            <Button asChild variant="secondary">
              <Link href="/jobs/manage">Manage my jobs</Link>
            </Button>
          )}
        </div>
        <div>
          <Label>Status</Label>
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
                <SelectLabel>Job Status</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Type</Label>
          <Select
            disabled={loading}
            value={jobType}
            onValueChange={handleTypeFilterChange}
          >
            <SelectTrigger className="w-full smax-w-[180px]">
              <SelectValue placeholder="Filter Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Job Type</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="FULL_TIME">Full time</SelectItem>
                <SelectItem value="PART_TIME">Part-time</SelectItem>
                <SelectItem value="INTERNSHIP">Internship</SelectItem>
                <SelectItem value="FREELANCE">Freelance</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {(filter !== "all" || jobType !== "all") && (
          <Button onClick={resetFilter}>Clear Filter</Button>
        )}
      </div>

      <div className="md:col-span-4 md:max-w-screen-lg md:mx-auto overflow-y-auto max-h-[80vh] scrollbar-hide">
        <h1 className="text-3xl font-medium">Job Opportunities</h1>
        <div className="space-y-5">
          {jobs.map((job, index) => (
            <JobCard key={`${index}-event-card-${job.id}`} {...job} />
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
        {!hasMore && !loading && jobs.length > 0 && (
          <p className="text-center text-muted-foreground py-8">
            You&apos;ve reached the end!
          </p>
        )}

        {/* No results message */}
        {!loading && jobs.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No jobs found for this filter.
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

function JobCard(job: Job) {
  return (
    <Link href={`/jobs/${job.id}`} key={job.id}>
      <Card className="overflow-hidden  p-5 transition-all max-w-screen-md  md:min-w-[50dvw] mb-5 hover:shadow-md">
        <CardContent className="p-2 relative">
          <Badge
            variant={JobStatusBadgeColorMap[job.status]}
            className="capitalize absolute top-2 right-2"
          >
            {job.status.toLowerCase()}
          </Badge>
          <h1 className="line-clamp-2 text-2xl">{job.title}</h1>
          <h2>{job.company}</h2>
          <div className="flex gap-2 ">
            {job.location} -{" "}
            <span className="capitalize">
              {job.type.replace("_", "-").toLowerCase()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
