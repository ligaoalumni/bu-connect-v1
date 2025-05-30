"use client";

import { readEventCommentsAction, writeEventCommentAction } from "@/actions";
import type { EventComment, PaginationResult } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
	AlertCircle,
	MessageCircle,
	MessageSquare,
	RefreshCw,
} from "lucide-react";
import CommentBox from "./comment-box-input";
import { createBrowserClient } from "@/lib";
import { CommentCard, CommentSkeleton } from "./comment";

interface EventCommentsSectionProps {
	eventSlug: string;
	id: number;
}

export function EventCommentsSection({
	eventSlug,
	id,
}: EventCommentsSectionProps) {
	const [comments, setComments] = useState(0);
	const [data, setData] = useState<PaginationResult<EventComment>>({
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

			const response = await readEventCommentsAction({
				slug: eventSlug,
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
	}, [eventSlug]);

	useEffect(() => {
		const db = createBrowserClient();
		const subscription = db
			.channel("event_comments_channel")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "event_comments",
					filter: `eventId=eq.${id}`,
				},
				async (payload) => {
					if (payload.new) {
						const { data } = await db
							.from("users")
							.select("*")
							.eq("id", payload.new.commentById)
							.single();

						if (data) {
							setData((prev) => ({
								...prev,
								data: [
									{
										createdAt: new Date().toISOString(),
										id: payload.new.id,
										name: `${data.firstName} ${data.lastName}`,
										avatar: data.avatar || "",
										studentId: String(data.studentId || ""),
										batch: String(data.batch || ""),
										comment: payload.new.comment,
									},
									...prev.data,
								],
							}));
							setComments((prev) => prev + 1);
						}
					}
				}
			)
			.subscribe();

		// Cleanup subscription on unmount
		return () => {
			subscription.unsubscribe();
		};
	}, []);

	async function handleWriteComment(comment: string) {
		try {
			await writeEventCommentAction({ comment, slug: eventSlug, eventId: id });
		} catch {
			// toast.error("Error writing comment", {
			// 	description: "Please try again later.",
			// 	richColors: true,
			// 	duration: 5000,
			// });
		} finally {
			setLoading({ ...loading, initialFetch: false });
		}
	}

	return (
		<div className="space-y-4 overflow-hidden break-words">
			<div className="flex items-center justify-between">
				<h1 className="font-medium text-lg flex items-center gap-2">
					<MessageCircle className="h-5 w-5" />
					Comments
					{!loading.initialFetch && !hasError && (
						<span className="text-sm text-muted-foreground">
							({comments || data.count})
						</span>
					)}
				</h1>
				{/* {!loading.initialFetch && (
					  <Button
						  variant="outline"
						  size="sm"
						  onClick={handleRefresh}
						  disabled={loading.fetchingMore || loading.initialFetch}>
						  <RefreshCw
							  className={`h-4 w-4 mr-2 ${
								  loading.initialFetch || loading.fetchingMore
									  ? "animate-spin"
									  : ""
							  }`}
						  />
						  Refresh
					  </Button>
				  )} */}
			</div>

			{/* Error State */}
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
						className="mt-2">
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

			<div>
				<CommentBox onSubmit={handleWriteComment} />
			</div>

			{/* Content State */}
			{!loading.initialFetch && !hasError && (
				<>
					{data.data.length > 0 ? (
						<div className="space-y-3">
							<div className="space-y-3 divide-y divide-gray-100">
								{data.data.map((comment) => (
									<div className="pt-3 first:pt-0" key={comment.id}>
										<CommentCard
											comment={comment.comment}
											commentId={comment.id}
											name={comment.name}
											avatar={comment.avatar || ""}
											timestamp={new Date(comment.createdAt)}
											userId={Number(comment.studentId)}
											batch={Number(comment.batch) || undefined}
										/>
									</div>
								))}
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
										onClick={() => handleFetchMore(true)}>
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
									You&aspo;ve reached the end of the list
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
