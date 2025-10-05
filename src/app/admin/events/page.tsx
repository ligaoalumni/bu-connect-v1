import { TableSkeleton } from "../_components/table-skeleton";
import dynamic from "next/dynamic";

const EventsDataTable = dynamic(
  () => import("../_components/events-data-table"),
  {
    loading: TableSkeleton,
  },
);

export default async function Page() {
  return (
    <div>
      <EventsDataTable />
    </div>
  );
}
