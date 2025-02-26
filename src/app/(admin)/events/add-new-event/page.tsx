import React from "react";
import EventForm from "../_components/event-form";
import { disableEvents } from "@/models";

export default async function CreateEventPage() {
	const disabledDates = await disableEvents();

	return <EventForm disabledDates={disabledDates} />;
}
