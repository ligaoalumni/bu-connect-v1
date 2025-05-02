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

	return <JobsInfiniteScroll defaultData={jobs.data} />;
}
