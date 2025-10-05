import { readPollAction } from "@/actions";
import { notFound } from "next/navigation";
import React from "react";
import dynamic from "next/dynamic";
import { LoaderComponent } from "@/components";

const AdminPollDetailPage = dynamic(() => import("./__components/details"), {
  loading: LoaderComponent,
});

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
    <AdminPollDetailPage
      poll={{
        ...poll,
        options: poll.options.map((option) => ({
          id: option.id,
          pollId: option.pollId,
          content: option.content,
          votes: option.votes.map((vote) => ({
            id: vote.id,
            createdAt: vote.createdAt,
          })),
        })),
      }}
    />
  );
}
