import { readPollAction } from "@/actions";
import { notFound } from "next/navigation";
import React from "react";

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	if (!slug) return notFound();

	const poll = await readPollAction(Number(slug));

	if (!poll) return notFound();

	return <div>Page</div>;
}
