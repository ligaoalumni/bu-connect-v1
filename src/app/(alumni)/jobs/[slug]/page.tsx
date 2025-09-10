import { readJobAction } from "@/actions";
import { Button, JobDetailsCard } from "@/components";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (isNaN(Number(slug))) return <div>Invalid Job ID</div>;

  const job = await readJobAction(Number(slug));

  if (!job) return <h1>Job Not Found</h1>;

  return (
    <div className="space-y-4 mt-10">
      <div className="flex gap-2 max-w-screen-lg mx-auto   ">
        <Button className="h-10 w-10 p-0  " asChild>
          <Link href="/jobs" className="text-3xl">
            <Icon icon="ci:chevron-left" width="24" height="24" className="" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl leading-none font-bold">Job Details</h1>
          <p className="text-sm leading-none text-muted-foreground">
            View the job details below.
          </p>
        </div>
      </div>
      <JobDetailsCard {...job} />
    </div>
  );
}
