import { readEvents } from "@/models";
import React, { Suspense } from "react";
import EventsDataTable from "../_components/events-data-table";
import { TableSkeleton } from "../_components/table-skeleton";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;

	const page = params.page ? Number(params.page) : 1;
	const limit = params.limit ? Number(params.limit) : 10;

	const data = await readEvents({
		pagination: { page, limit },
	});

	return (
		<div>
			<Suspense fallback={<TableSkeleton />}>
				<EventsDataTable
					currentPage={page}
					pageSize={limit}
					data={data.data}
					total={data.count}
				/>
			</Suspense>
		</div>
	);
}
