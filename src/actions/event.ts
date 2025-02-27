"use server";

import { EventFormSchema } from "@/lib/definitions";
import { createEvent, readEvents, updateEvent } from "@/models";
import { EventFormData, EventStatus, PaginationArgs } from "@/types";
import { revalidatePath } from "next/cache";

export const createEventAction = async (data: EventFormData) => {
	const parsed = EventFormSchema.safeParse(data);
	try {
		if (!parsed.success) {
			throw new Error("Invalid form data");
		}

		const event = await createEvent({
			...data,
			endDate: data.endDate || data.startDate,
		});

		revalidatePath("/events");
		return event;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to create event");
	}
};

export const updateEventAction = async (data: EventFormData, id: number) => {
	const parsed = EventFormSchema.safeParse(data);
	try {
		if (!parsed.success) {
			throw new Error("Invalid form data");
		}

		const event = await updateEvent({
			...data,
			coverImg: data.coverImg ?? "",
			endDate: data.endDate || data.startDate,
			id,
		});

		revalidatePath("/events");
		return event;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to create event");
	}
};

export const readEventsAction = async (
	args: PaginationArgs<EventStatus> = {}
) => {
	try {
		const events = await readEvents(args);
		return events;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to fetch events");
	}
};
