import { Suspense } from "react";
import { TableSkeleton } from "../../_components/table-skeleton";
import AlumniDataTable from "../../_components/alumni-table";

export default async function AlumniPage() {
	return (
		<div>
			<Suspense fallback={<TableSkeleton />}>
				<AlumniDataTable />
			</Suspense>
		</div>
	);
}
