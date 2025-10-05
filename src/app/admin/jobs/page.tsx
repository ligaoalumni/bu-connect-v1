import { TableSkeleton } from "../_components/table-skeleton";
import dynamic from "next/dynamic";
const JobsDataTable = dynamic(() => import("../_components/jobs-data-table"), {
  loading: TableSkeleton,
});

export default async function Page() {
  return (
    <div>
      <JobsDataTable />
    </div>
  );
}
