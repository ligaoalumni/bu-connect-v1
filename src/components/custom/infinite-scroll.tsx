"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { EventStatus, EventWithPagination } from "@/types";
import EventCard from "./event-card";
import { readEventsAction } from "@/actions";
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

export function InfiniteScroll({
	defaultData,
	moreData = false,
}: {
	defaultData: EventWithPagination[];
	moreData?: boolean;
}) {
	const [events, setEvents] = useState<EventWithPagination[]>(
		defaultData || []
	);
	const [filter, setFilter] = useState<EventStatus | "all">("all");
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

			const result = await readEventsAction({
				pagination: {
					page: currentPage,
					limit: 8,
				},
				status:
					currentFilter === "all" ? undefined : [currentFilter as EventStatus],
			});

			if (resetData) {
				setEvents(result.data);
			} else {
				setEvents((prev) => [...prev, ...result.data]);
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
		setFilter(value as EventStatus | "all");

		// Reset to initial state for the new filter
		setPage(0);
		setHasMore(true);

		if (value === "all") {
			// For "all" filter, we can immediately set the default data
			setEvents(defaultData);
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
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-medium">Events</h1>
				<Select
					disabled={loading}
					value={filter}
					onValueChange={handleFilterChange}>
					<SelectTrigger className="w-full max-w-[180px]">
						<SelectValue placeholder="Filter Event" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Event Status</SelectLabel>
							<SelectItem value="all">All</SelectItem>
							<SelectItem value="Upcoming Event">Upcoming Event</SelectItem>
							<SelectItem value="Ongoing Event">Ongoing Event</SelectItem>
							<SelectItem value="Past Event">Past Event</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{events.map((event, index) => (
					<EventCard key={`${index}-event-card-${event.slug}`} {...event} />
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
			{!hasMore && !loading && events.length > 0 && (
				<p className="text-center text-muted-foreground py-8">
					You&apos;ve reached the end!
				</p>
			)}

			{/* No results message */}
			{!loading && events.length === 0 && (
				<p className="text-center text-muted-foreground py-8">
					No events found for this filter.
				</p>
			)}
			{isFilterChanging && <FilterChangeOverlay />}
			{showBackToTop && (
				<Button
					size="icon"
					onClick={scrollToTop}
					className="fixed bottom-8 right-8 p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg transition-all duration-300 animate-in fade-in zoom-in"
					aria-label="Back to top">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="w-6 h-6">
						<path d="m18 15-6-6-6 6" />
					</svg>
				</Button>
			)}
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
		<div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
				<p className="text-lg font-medium">Updating results...</p>
			</div>
		</div>
	);
}
