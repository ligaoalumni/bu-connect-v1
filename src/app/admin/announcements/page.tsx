import { TableSkeleton } from "../_components/table-skeleton";
import { Button } from "@/components";
import Link from "next/link";
import dynamic from "next/dynamic";

const AnnouncementsDataTable = dynamic(
  () => import("../_components/announcement-table"),
  {
    loading: TableSkeleton,
  },
);

export default async function Page() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-medium">Announcements</h1>
          <p className="text-sm text-gray-600">Manage your announcements.</p>
        </div>
        <Button>
          <Link href="/admin/announcements/add">Add Announcement</Link>
        </Button>
      </div>

      <AnnouncementsDataTable />
    </div>
  );
}
