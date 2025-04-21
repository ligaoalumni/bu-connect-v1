import { Suspense } from "react";
import { TableSkeleton } from "../_components/table-skeleton";
import AnnouncementsDataTable from "../_components/announcement-table";

export default async function Page() {
	return (
		<div>
			<Suspense fallback={<TableSkeleton />}>
				<AnnouncementsDataTable />
			</Suspense>
		</div>
	);
}
