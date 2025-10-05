import { TableSkeleton } from "../../_components/table-skeleton";
import { Button } from "@/components";
import Link from "next/link";
import dynamic from "next/dynamic";

const OldAlumniDataTable = dynamic(
  () => import("../../_components/old-alumni-data-table"),
  {
    loading: TableSkeleton,
  },
);

export default async function OldAlumniPage() {
  return (
    <div className="space-y-5  ">
      <div className="flex justify-between">
        <div>
          <h1 className="font-medium text-2xl">List of old alumni</h1>
          <p className="text-sm text-muted-foreground">
            List of old alumni data imported from external sources.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/alumni/old/add">Add Old Alumni</Link>
        </Button>
      </div>
      <OldAlumniDataTable />
    </div>
  );
}
