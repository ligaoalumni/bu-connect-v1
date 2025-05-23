import React, { Suspense } from "react";
import { TableSkeleton } from "../_components/table-skeleton";
import RecruitmentDataTable from "./__components/recruitment-data-table";

export default function Page() {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<RecruitmentDataTable />
		</Suspense>
	);
}
