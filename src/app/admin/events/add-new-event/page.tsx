import React from "react";
import { getDisabledEvents } from "@/repositories";
import dynamic from "next/dynamic";
import { LoaderComponent } from "@/components";

const EventForm = dynamic(() => import("../_components/event-form"), {
  loading: LoaderComponent,
});

export default async function CreateEventPage() {
  const events = await getDisabledEvents();

  return <EventForm events={events} />;
}
