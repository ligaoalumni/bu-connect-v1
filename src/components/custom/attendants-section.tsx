"use client";
import { readAttendantsAction } from "@/actions";
import { Attendant, PaginationResult } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AttendantsSectionProps {
	eventSlug: string;
}

export default function AttendantsSection({
	eventSlug,
}: AttendantsSectionProps) {
	const [data, setData] = useState<PaginationResult<Attendant>>({
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
				initialFetch: !fetchMore,
				fetchingMore: fetchMore || false,
			});
			const response = await readAttendantsAction({
				slug: eventSlug,
				pagination,
			});

			setData(response);
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

	useEffect(() => {
		handleFetchMore();
	}, [eventSlug]);

	console.log(loading, data, "qqq");
	return (
		<div className="space-y-2 overflow-hidden break-words">
			<h1 className="font-medium text-lg">Attendants</h1>
			{!hasError ? (
				!loading.initialFetch ? (
					data.data.length > 0 ? (
						<div className="space-y-2">
							{data.data.map((attendant) => (
								<AttendantCard {...attendant} key={attendant.lrn} />
							))}
							{data.hasMore && (
								<button
									className="bg-blue-500 text-white px-4 py-2 rounded"
									onClick={() => {
										setPagination((prev) => ({
											limit: prev.limit,
											page: prev.page + 1,
										}));
										handleFetchMore(true);
									}}>
									Load More
								</button>
							)}
						</div>
					) : (
						<p>No attendants found</p>
					)
				) : (
					<p>loading...</p>
				)
			) : (
				<></>
			)}
		</div>
	);
}

const AttendantCard = (attendant: Attendant) => {
	return (
		<div className="flex items-center gap-2">
			<Avatar>
				<AvatarImage src={attendant.avatar} />
				<AvatarFallback>
					{attendant.firstName[0]}
					{attendant.lastName[0]}
				</AvatarFallback>
			</Avatar>
			<div>
				<h1 className="font-medium">
					{attendant.firstName} {attendant.lastName}
				</h1>
				<p className="text-sm text-gray-500">
					{attendant.batch} {attendant.strand && `- ${attendant.strand}`}
				</p>
			</div>
		</div>
	);
};
