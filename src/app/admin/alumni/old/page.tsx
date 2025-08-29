import { Suspense } from "react";
import { TableSkeleton } from "../../_components/table-skeleton";
import OldAlumniDataTable from "../../_components/old-alumni-data-table";
import { Button } from "@/components";
import Link from "next/link";

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
      <Suspense fallback={<TableSkeleton />}>
        <OldAlumniDataTable />
      </Suspense>
    </div>
  );
}
