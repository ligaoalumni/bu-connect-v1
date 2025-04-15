"use server";

import { EventFormSchema } from "@/lib/definitions";
import {
	addEventAttendant,
	createEvent,
	readAttendants,
	readEvents,
	updateEvent,
} from "@/models";
import {
	EventFormData,
	EventStatus,
	PaginationArgs,
	TEventPagination,
} from "@/types";
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
	args: PaginationArgs<EventStatus, never> = {}
) => {
	try {
		const events = await readEvents(args);
		return events;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to fetch events");
	}
};

export const addEventAttendantAction = async ({
	eventId,
	lrn,
}: {
	eventId: number;
	lrn: string;
}) => {
	// const;
	try {
		await addEventAttendant({
			eventId,
			attendantLrn: lrn,
		});

		revalidatePath("/events");

		return { success: true, message: "Attendant added successfully" };
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Failed to add attendant";

		return { success: false, message: errorMessage };
	}
};

export const readAttendantsAction = async ({
	slug,
	pagination,
}: TEventPagination) => {
	try {
		return await readAttendants({ slug, pagination });
	} catch {
		throw new Error("Failed to fetch attendants");
	}
};
