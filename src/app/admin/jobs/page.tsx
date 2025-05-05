import { Suspense } from "react";
import { TableSkeleton } from "../_components/table-skeleton";
import JobsDataTable from "../_components/jobs-data-table";

export default async function Page() {
	return (
		<div>
			<Suspense fallback={<TableSkeleton />}>
				<JobsDataTable />
			</Suspense>
		</div>
	);
}
