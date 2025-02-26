import { Suspense } from "react";
import EventsDataTable from "../_components/events-data-table";
import { TableSkeleton } from "../_components/table-skeleton";

export default async function Page() {
	return (
		<div>
			<Suspense fallback={<TableSkeleton />}>
				<EventsDataTable />
			</Suspense>
		</div>
	);
}
