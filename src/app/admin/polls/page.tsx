import { TableSkeleton } from "../_components/table-skeleton";
import dynamic from "next/dynamic";

const PollsDataTable = dynamic(
  () => import("../_components").then((mod) => mod.PollsDataTable),
  { loading: TableSkeleton },
);

export default async function Page() {
  return (
    <div>
      <PollsDataTable />
    </div>
  );
}
