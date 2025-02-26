import prisma from "@/lib/prisma";

import {
	Event,
	EventPartialRelation,
	EventWithPagination,
	PaginationArgs,
	PaginationResult,
} from "@/types";
import { Prisma } from "@prisma/client";
import { isFuture } from "date-fns";
import slug from "unique-slug";

export const readEvent = async (
	slug: string | number
): Promise<EventPartialRelation | null> => {
	let where: Prisma.EventWhereUniqueInput = { id: Number(slug) };

	if (typeof slug === "string") {
		where = { slug };
	}

	const event = await prisma.event.findUnique({
		where,
		include: {
			interested: {
				select: {
					firstName: true,
					lastName: true,
					email: true,
					id: true,
				},
			},
			alumni: {
				select: {
					firstName: true,
					lastName: true,
					email: true,
					id: true,
				},
			},
		},
	});

	if (!event) return null;

	return {
		...event,
		coverImg: event.coverImg || "",
	};
};

export const createEvent = async (
	data: Omit<
		Event,
		"id" | "createdAt" | "updatedAt" | "interested" | "alumni" | "slug"
	>
) => {
	const timestamp = Date.now(); // current timestamp
	const randomPart = Math.random().toString(36).substring(2, 10); // random string (base 36)
	const name = data.name.toLowerCase().replace(/ /g, "-");
	const generatedSlug = slug(name);

	const createdEvent = await prisma.event.create({
		data: {
			...data,
			endDate: data.endDate || data.startDate,
			slug: `${name}-${timestamp}-${randomPart}-${generatedSlug}`,
			// slug: "test-7-1740444042069-yoje5jym-394d791c",
		},
	});

	return createdEvent;
};

export const readEvents = async ({
	filter,
	pagination,
	order,
	orderBy,
}: PaginationArgs = {}): Promise<PaginationResult<EventWithPagination>> => {
	let where: Prisma.EventWhereInput = {};

	if (filter && typeof filter === "number") {
		where = {
			id: filter,
		};
	}

	if (typeof filter === "string") {
		where = {
			OR: [{ name: { contains: filter, mode: "insensitive" } }],
		};
	}

	const events = await prisma.event.findMany({
		where,
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
		orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
		include: {
			alumni: true,
			interested: true,
		},
	});

	const count = await prisma.event.count({ where });

	return {
		count,
		hasMore: events.length === pagination?.limit,
		data: events.map((event) => ({
			...event,
			alumni: event.alumni.length,
			interested: event.interested.length,
			coverImg: event.coverImg || "",
		})),
	};
};

export const updateEvent = async (
	data: Omit<
		Event,
		"createdAt" | "updatedAt" | "interested" | "alumni" | "slug"
	>
) => {
	const isExists = await prisma.event.findUnique({
		where: { id: data.id },
	});

	if (!isExists) {
		throw new Error("Event not found");
	}

	let generatedSlug: string | undefined = undefined;

	if (isExists.name !== data.name) {
		const timestamp = Date.now(); // current timestamp
		const randomPart = Math.random().toString(36).substring(2, 10); // random string (base 36)
		const name = data.name.toLowerCase().replace(/ /g, "-");
		generatedSlug = `${name}-${timestamp}-${randomPart}-${slug(name)}`;
	}

	const updatedEvent = await prisma.event.update({
		data: {
			...data,
			endDate: data.endDate || data.startDate,
			slug: generatedSlug,
		},
		where: {
			id: isExists.id,
		},
	});

	return updatedEvent;
};

export const disableEvents = async () => {
	const allEvents = await readEvents();
	const futureEvents = allEvents.data.filter((event) =>
		isFuture(event.startDate)
	);

	return futureEvents.map((event) => ({
		startDate: event.startDate,
		endDate: event.endDate || event.startDate,
		title: event.name,
	}));
};
