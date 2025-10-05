import dynamic from "next/dynamic";
import { TableSkeleton } from "@/app/admin/_components/table-skeleton";

const VerifyAccountDataTable = dynamic(
  () => import("../../__components/verify-account-table"),
  {
    loading: TableSkeleton,
  },
);

export default function VerifyOldAlumniAccountPage() {
  return (
    <>
      <div className="w-full  ">
        <h1 className="text-xl font-medium">Verify Old Alumni Account</h1>
        <p className="text-muted-foreground mt-2">
          Account verification system
        </p>
      </div>
      <VerifyAccountDataTable />
    </>
  );
}
