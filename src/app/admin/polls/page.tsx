import { Suspense } from "react";
import { TableSkeleton } from "../_components/table-skeleton";
import { PollsDataTable } from "../_components";

export default async function Page() {
	return (
		<div>
			<Suspense fallback={<TableSkeleton />}>
				<PollsDataTable />
			</Suspense>
		</div>
	);
}
