import { readPollAction } from "@/actions";
import { notFound } from "next/navigation";
import { PollCard } from "../../__components/poll-card";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug || isNaN(parseInt(slug))) return notFound();

  const poll = await readPollAction(Number(slug));

  if (!poll) return notFound();

  return (
    <div className="mt-10 px-5 md:px-10">
      <h3 className="text-2xl font-bold">Poll</h3>
      <PollCard
        defaultPoll={{
          ...poll,
          votes: poll.votes,
          options: poll.options.map((opt) => ({
            id: opt.id,
            content: opt.content,
            pollId: opt.pollId,
            votes: opt.votes.map((vote) => ({
              userId: vote.userId,
            })),
          })),
        }}
        key={poll.id}
      />
    </div>
  );
}
