import {
  readBatchesAction,
  readPollsAction,
  readRecruitmentListAction,
} from "@/actions";
import { EmptyState } from "@/components";
import React from "react";
import { PollCard } from "./__components/poll-card";
import RecruitmentInfo from "@/app/admin/recruitment/__components/recruitment-info";
import Link from "next/link";

export default async function Page() {
  const polls = await readPollsAction({
    status: ["OPEN"],
  });
  const recruitments = await readRecruitmentListAction({
    status: ["OPEN"],
  });
  const batches = await readBatchesAction();

  return (
    <div className="container mx-auto space-y-10 mt-10 px-5 md:px-10">
      <section>
        <h1 className="text-2xl font-medium">Polls</h1>
        <div className="space-y-4 mt-5">
          {polls.data.length > 0 ? (
            polls.data.map((poll) => (
              <PollCard defaultPoll={poll} key={poll.id} />
            ))
          ) : (
            <EmptyState
              title="No polls available"
              description="Currently, there are no polls available. Please check back later."
              showRedirectButton={false}
            />
          )}
        </div>
      </section>

      <section>
        <h1 className="text-2xl font-medium">Recruitment</h1>
        <div className="flex flex-col gap-y-5 mt-5">
          {recruitments.data.length > 0 ? (
            recruitments.data.map((recruitment) => (
              <Link
                className="mb-3"
                href={`/highlights/recruitments/${recruitment.id}`}
                key={`link-to-recruitment-${recruitment.id}`}
              >
                <RecruitmentInfo
                  recruitment={recruitment}
                  batches={batches.data.map((b) => b.batch)}
                />
              </Link>
            ))
          ) : (
            <EmptyState
              title="No recruitments available"
              description="Currently, there are no recruitments available. Please check back later."
              showRedirectButton={false}
            />
          )}
        </div>
      </section>
    </div>
  );
}
