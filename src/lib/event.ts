import { EventDateTime } from "@/types";
import { isAfter, isBefore, isEqual } from "date-fns";

export const getEventStatus = (event: EventDateTime) => {
	const now = new Date();

	const startDateTime = new Date(event.startDate);

	startDateTime.setHours(
		event.startTime.getHours(),
		event.startTime.getMinutes(),
		0,
		0
	); // Set correct time

	const endDateTime = new Date(event?.endDate || event.startDate);

	endDateTime.setHours(
		event.endTime.getHours(),
		event.endTime.getMinutes(),
		0,
		0
	);
	// Check if the current time is before the start of the event
	if (isBefore(now, startDateTime)) {
		return "Upcoming Event";
	}

	// Check if the current time is after the end of the event
	if (isAfter(now, endDateTime)) {
		return "Past Event";
	}

	// If the current time is between the start and end times, the event is ongoing
	if (
		(isAfter(now, startDateTime) && isBefore(now, endDateTime)) ||
		isEqual(now, startDateTime) ||
		isEqual(now, endDateTime)
	) {
		return "Ongoing Event";
	}

	console.log(startDateTime);
	console.log(endDateTime);

	return "Unknown Status";
};
