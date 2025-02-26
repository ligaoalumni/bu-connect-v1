import { getDisabledEvents, readEvent } from "@/models";
import { notFound } from "next/navigation";
import EventForm from "../../_components/event-form";

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
