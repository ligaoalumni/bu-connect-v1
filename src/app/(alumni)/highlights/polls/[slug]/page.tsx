import { readPollAction } from "@/actions";
import { notFound } from "next/navigation";

import Link from "next/link";
import {
  Button,
  LoaderComponent,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { ChevronLeft } from "lucide-react";
import dynamic from "next/dynamic";

const PollCard = dynamic(
  () => import("../../__components/poll-card").then((mod) => mod.PollCard),
  {
    loading: LoaderComponent,
  },
);

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
    <div className="mt-10 px-5 md:px-10  ">
      <div className="flex gap-4 mb-5">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button size="icon" asChild>
                <Link href="/highlights">
                  <ChevronLeft />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Back to highlights</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <h3 className="text-2xl font-bold">Poll</h3>
      </div>
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
