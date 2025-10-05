import { getDisabledEvents, readEvent } from "@/repositories";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { LoaderComponent } from "@/components";

const EventForm = dynamic(() => import("../../_components/event-form"), {
  loading: LoaderComponent,
});

async function getEvent(slug: string) {
  const event = await readEvent(slug);
  const events = await getDisabledEvents();

  if (!event) {
    notFound();
  }

  return { event, events };
}

export default async function EditEvent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { event, events } = await getEvent(slug);

  return <EventForm edit event={event} events={events} />;
}
