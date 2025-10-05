import dynamic from "next/dynamic";
import React from "react";

const JobForm = dynamic(
  () => import("../../../../../components/custom/job-form"),
);

export default function Page() {
  return (
    <div className="mt-10 px-5 md:px-10">
      <h1 className="text-center font-bold text-3xl mb-4">Job Opportunity</h1>
      <JobForm />
    </div>
  );
}
