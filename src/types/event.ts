import { Alumni } from "./alumni";

export interface Event {
	readonly id: number;
	slug: string;
	name: string;
	content: string;
	coverImg: string | null;
	startDate: Date;

	endDate: Date | null;
	location: string;

	interested: Alumni[];
	alumni: Alumni[];

	createdAt: Date;
	updatedAt: Date;
}

export type EventPartialRelation = Omit<Event, "interested" | "alumni"> & {
	alumni: Pick<Alumni, "id" | "firstName" | "lastName" | "email">[];
	interested: Pick<Alumni, "id" | "firstName" | "lastName" | "email">[];
};

export type EventWithoutRelations = Omit<Event, "interested" | "alumni">;

export type EventWithPagination = Omit<Event, "interested" | "alumni"> & {
	interested: number;
	alumni: number;
};
