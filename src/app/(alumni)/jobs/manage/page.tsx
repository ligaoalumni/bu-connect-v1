import JobsDataTable from "@/app/admin/_components/jobs-data-table";
import { TableSkeleton } from "@/app/admin/_components/table-skeleton";
import { Button } from "@/components";
import Link from "next/link";
import React, { Suspense } from "react";

export default function Page() {
  return (
    <div className="mt-10 px-5 md:px-10">
      <div className="flex pt-2 pb-4 items-center justify-between">
        <h1 className="text-3xl font-medium">Mange posted jobs</h1>
        <Button asChild variant="secondary">
          <Link href="/jobs/manage/add">
            <span className="text-sm">Post a job</span>
          </Link>
        </Button>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <JobsDataTable managedByAlumni />
      </Suspense>
    </div>
  );
}
