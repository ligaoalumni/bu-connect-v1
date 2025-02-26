import React from "react";
import EventForm from "../_components/event-form";
import { getDisabledEvents } from "@/models";

export default async function CreateEventPage() {
	const disabledDates = await getDisabledEvents();

	return <EventForm disabledDates={disabledDates} />;
}
