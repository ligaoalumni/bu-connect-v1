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

	const page = params.page ? Number(params.page) : 0;
	const limit = params.limit ? Number(params.limit) : 10;
	const filter = params.filter ? String(params.filter) : undefined;

	const data = await readEvents({
		filter,
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
