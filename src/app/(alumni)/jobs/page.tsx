import { readJobsAction } from "@/actions";
import { JobsInfiniteScroll } from "@/components/custom/jobs-infinite-scroll";
import React from "react";

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
