import { Suspense } from "react";
import { TableSkeleton } from "../../_components/table-skeleton";
import OldAlumniDataTable from "../../_components/old-alumni-data-table";
import { OldAccountModal } from "../__components";

export default async function OldAlumniPage() {
  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <div>
          <h1 className="font-medium text-2xl">List of old alumni</h1>
          <p className="text-sm text-muted-foreground">
            List of old alumni data imported from external sources.
          </p>
        </div>
        <OldAccountModal
          initialValue={{
            batch: 23,
            birthDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            firstName: "sda",
            id: 1,
            lastName: "ads",
            middleName: "",
            program: "dsas",
          }}
        />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <OldAlumniDataTable />
      </Suspense>
    </div>
  );
}
