import AnnouncementsDataTable from "@/app/admin/_components/announcement-table";
import { TableSkeleton } from "@/app/admin/_components/table-skeleton";
import { Button } from "@/components";
import Link from "next/link";
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5 px-5 md:px-10 mt-5">
        <div>
          <h1 className="text-2xl font-medium">Announcements</h1>
          <p className="text-sm text-gray-600">Manage your announcements.</p>
        </div>
        <Button>
          <Link href="/announcements/add">Add Announcement</Link>
        </Button>
      </div>

      <div className="px-5 md:px-10 mb-10">
        <Suspense fallback={<TableSkeleton />}>
          <AnnouncementsDataTable />
        </Suspense>
      </div>
    </div>
  );
}
