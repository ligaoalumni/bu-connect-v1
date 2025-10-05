import { LoaderComponent } from "@/components";

import { getEventStatus } from "@/lib";
import { readEvent } from "@/repositories";
import { formatDate, isSameDay } from "date-fns";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import React from "react";

const EventInfo = dynamic(
  () => import("@/components/custom/event-info").then((mod) => mod.EventInfo),
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
  const event = await readEvent(slug);

  if (!event) return notFound();

  const isOneDay = isSameDay(
    event.startDate,
    event?.endDate || event.startDate,
  );
  const startDate = formatDate(
    event.startDate,
    isOneDay ? "MMMM d, yyyy" : "MMMM d,",
  );
  const endDate = formatDate(event!.endDate!, "- MMMM dd, yyyy");
  const date = `${startDate}${isOneDay ? "" : endDate}`;

  const status = getEventStatus({
    endDate: event.endDate || event.startDate,
    startDate: event.startDate,
    endTime: event.endTime,
    startTime: event.startTime,
  });

  return (
    <div className="px-5 md:px-10 mt-10">
      <EventInfo date={date} status={status} event={event} />
    </div>
  );
}
