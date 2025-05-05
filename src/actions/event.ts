"use server";

import { EventFormSchema } from "@/lib/definitions";
import { decrypt } from "@/lib/session";
import {
	addEventAttendant,
	addInterestEvent,
	createEvent,
	readAttendants,
	readEventComments,
	readEvents,
	readInterestedAlumni,
	updateEvent,
	writeEventComment,
} from "@/repositories";
import {
	EventFormData,
	EventStatus,
	PaginationArgs,
	TEventPagination,
} from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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
	id,
}: {
	eventId: number;
	id: number;
}) => {
	// const;
	try {
		await addEventAttendant({
			eventId,
			id,
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

export const readEventCommentsAction = async ({
	slug,
	pagination,
}: TEventPagination) => {
	try {
		return await readEventComments({ slug, pagination });
	} catch (err) {
		console.log(err);
		throw new Error("Failed to fetch comments");
	}
};

export const addInterestEventAction = async (eventId: number) => {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		if (!session?.id) throw new Error("Unauthorized");

		return await addInterestEvent({ eventId, userId: session.id });
	} catch (err) {
		console.log(err);
		throw new Error("Failed to fetch comments");
	}
};

export const readInterestedAlumniAction = async ({
	slug,
	pagination,
}: TEventPagination) => {
	try {
		return await readInterestedAlumni({ slug, pagination });
	} catch {
		throw new Error("Failed to fetch interested alumni");
	}
};

export const writeEventCommentAction = async ({
	comment,
	eventId,
	slug,
}: {
	eventId: number;
	comment: string;
	slug: string;
}) => {
	try {
		const cookieStore = await cookies();

		const session = await decrypt(cookieStore.get("session")?.value);

		if (!session?.id) throw new Error("Unauthorized");

		await writeEventComment({ userId: session.id, comment, eventId });

		revalidatePath(`/events/${slug}`);
	} catch {
		throw new Error("Failed to fetch interested alumni");
	}
};
