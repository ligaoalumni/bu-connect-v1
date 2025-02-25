"use server";

import { EventFormSchema } from "@/lib/definitions";
import { createEvent } from "@/models";
import { EventFormData } from "@/types";
import { revalidatePath } from "next/cache";

export const createEventAction = async (data: EventFormData) => {
	const parsed = EventFormSchema.safeParse(data);
	try {
		if (!parsed.success) {
			throw new Error("Invalid form data");
		}

		const event = await createEvent({
			...data,
			coverImg: data.coverImg ?? "",
			endDate: data.endDate || data.startDate,
		});

		revalidatePath("/events");
		return event;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to create event");
	}
};
