import { readPollAction } from "@/actions";
import { notFound } from "next/navigation";
import React from "react";
import dynamic from "next/dynamic";
import { LoaderComponent } from "@/components";

const PollForm = dynamic(
  () => import("../../__components/poll-form").then((mod) => mod.PollForm),
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

  if (!slug) return notFound();

  const poll = await readPollAction(Number(slug));

  if (!poll) return notFound();

  return (
    <div className="min-h-[82dvh] flex items-center justify-center">
      <PollForm
        poll={{
          id: poll.id,
          question: poll.question,
          options: poll.options.map((option) => ({
            id: option.id,
            content: option.content,
          })),
        }}
        isEditing
      />
    </div>
  );
}
