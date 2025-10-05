import { TableSkeleton } from "../_components/table-skeleton";
import dynamic from "next/dynamic";

const AdminsDataTable = dynamic(
  () => import("../_components/admins-data-table"),
  {
    loading: TableSkeleton,
  },
);

export default async function AdminsPage() {
  return (
    <div>
      <AdminsDataTable />
    </div>
  );
}
