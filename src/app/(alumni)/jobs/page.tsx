import { readJobsAction } from "@/actions";
import { LoaderComponent } from "@/components";
import dynamic from "next/dynamic";
import React from "react";

const JobsInfiniteScroll = dynamic(
  () =>
    import("@/components/custom/jobs-infinite-scroll").then(
      (mod) => mod.JobsInfiniteScroll,
    ),
  {
    loading: LoaderComponent,
  },
);

export default async function Page() {
  const jobs = await readJobsAction({
    pagination: {
      page: 0,
      limit: 10,
    },
    status: ["OPEN", "COMPLETED", "CLOSED"],
  });

  return (
    <div className="mt-10 px-5 md:px-10">
      <JobsInfiniteScroll defaultData={jobs.data} />;
    </div>
  );
}
