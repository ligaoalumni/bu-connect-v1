import React from "react";
import EventForm from "../_components/event-form";
import { getDisabledEvents } from "@/repositories";

export default async function CreateEventPage() {
	const events = await getDisabledEvents();

	return <EventForm events={events} />;
}
