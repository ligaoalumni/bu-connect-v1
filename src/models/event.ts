import prisma from "@/lib/prisma";
import {
	Event,
	EventPartialRelation,
	EventWithPagination,
	PaginationArgs,
	PaginationResult,
} from "@/types";
import { Prisma } from "@prisma/client";
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

	return event;
};

export const createEvent = async (
	data: Omit<Event, "id" | "createdAt" | "updatedAt" | "interested" | "alumni">
) => {
	const generatedSlug = slug(data.name.toLowerCase().replace(/ /g, "-"));

	const createdEvent = await prisma.event.create({
		data: {
			...data,
			slug: generatedSlug,
		},
	});

	return createdEvent;
};

export const readEvents = async ({
	filter,
	pagination,
}: PaginationArgs): Promise<PaginationResult<EventWithPagination>> => {
	let where: Prisma.EventWhereInput = {};

	if (filter && typeof filter === "number") {
		where = {
			id: filter,
		};
	}

	if (typeof filter === "string") {
		where = {
			OR: [{ slug: { contains: filter } }, { name: { contains: filter } }],
		};
	}

	const events = await prisma.event.findMany({
		where,
		skip: pagination ? pagination.limit * pagination?.page : undefined,
		take: pagination ? pagination.limit : undefined,
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
		})),
	};
};
