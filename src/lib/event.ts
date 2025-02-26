import { EventWithPagination, EventDateTime } from "@/types";
import { formatDate, isAfter, isBefore, isEqual, isSameDay } from "date-fns";

export const getEventStatus = (event: EventDateTime) => {
	const now = new Date();

	const startDateTime = event.startDate;

	startDateTime.setHours(
		event.startTime.getHours(),
		event.startTime.getMinutes(),
		0,
		0
	); // Set correct time

	const endDateTime = event?.endDate || event.startDate;

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

	return "Unknown Status";
};

export const getEventDescription = (event: EventWithPagination) => {
	const status = getEventStatus({
		endDate: event.endDate || event.startDate,
		startDate: event.startDate,
		startTime: event.startTime,
		endTime: event.endTime,
	});

	const oneDay = isSameDay(event.startDate, event.endDate || event.startDate);
	const startDate = formatDate(
		event.startDate,
		oneDay ? "MMM dd, yyyy" : "MMM dd "
	);
	const endDate = formatDate(event.endDate || event.startDate, "MMM dd, yyyy");
	let label = "";

	if (oneDay) {
		if (status === "Upcoming Event") {
			label = `Event will be held on ${startDate} at ${event.location}`;
		} else if (status === "Ongoing Event") {
			label = `Event is ongoing at ${event.location}`;
		} else if (status === "Past Event") {
			label = `Event was held on ${startDate} at ${event.location}`;
		}
	} else {
		if (status === "Upcoming Event") {
			label = `Event will be held from ${startDate} to ${endDate} at ${event.location}`;
		} else if (status === "Ongoing Event") {
			label = `Event is ongoing from ${startDate} to ${endDate} at ${event.location}`;
		} else if (status === "Past Event") {
			label = `Event was held from ${startDate} to ${endDate} at ${event.location}`;
		}
	}

	return label;
};
