import React from "react";
import { TableSkeleton } from "../_components/table-skeleton";
import dynamic from "next/dynamic";
const RecruitmentDataTable = dynamic(
  () => import("./__components/recruitment-data-table"),
  {
    loading: TableSkeleton,
  },
);

export default function Page() {
  return <RecruitmentDataTable />;
}
