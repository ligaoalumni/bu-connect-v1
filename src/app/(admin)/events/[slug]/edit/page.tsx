import { readEvent } from "@/models";
import { notFound } from "next/navigation";
import EventForm from "../../_components/event-form";

async function getEvent(slug: string) {
	const event = await readEvent(slug);

	if (!event) {
		notFound();
	}

	return event;
}

export default async function EditEvent({
	params,
}: {
	params: { slug: string };
}) {
	const { slug } = await params;
	const event = await getEvent(slug);

	return <EventForm edit event={event} />;
}
