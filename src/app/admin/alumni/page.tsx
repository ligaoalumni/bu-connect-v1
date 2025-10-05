import { TableSkeleton } from "../_components/table-skeleton";
import dynamic from "next/dynamic";

const AlumniDataTable = dynamic(
  () => import("../_components/alumni-accounts-table"),
  {
    loading: TableSkeleton,
  },
);

export default async function AlumniPage() {
  return (
    <div>
      <AlumniDataTable />
    </div>
  );
}
