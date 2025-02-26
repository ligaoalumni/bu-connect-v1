import { disableEvents, readEvent } from "@/models";
import { notFound } from "next/navigation";
import EventForm from "../../_components/event-form";

async function getEvent(slug: string) {
	const event = await readEvent(slug);
	const disabledDates = await disableEvents();

	if (!event) {
		notFound();
	}

	return { event, disabledDates };
}

export default async function EditEvent({
	params,
}: {
	params: { slug: string };
}) {
	const { slug } = await params;
	const { event, disabledDates } = await getEvent(slug);

	return <EventForm edit event={event} disabledDates={disabledDates} />;
}
