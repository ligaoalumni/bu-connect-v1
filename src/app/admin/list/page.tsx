import { Suspense } from "react";
import { TableSkeleton } from "../_components/table-skeleton";
import AdminsDataTable from "../_components/admins-data-table";

export default async function AdminsPage() {
	return (
		<div>
			<Suspense fallback={<TableSkeleton />}>
				<AdminsDataTable />
			</Suspense>
		</div>
	);
}
