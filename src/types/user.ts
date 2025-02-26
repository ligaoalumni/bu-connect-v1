import { Alumni } from "./alumni";

export interface User {
	readonly id: number;
	email: string;
	role: UserRole;
	password: string;
	firstName: string;
	lastName: string;
	avatar?: string;

	alumni: Alumni | null;

	createdAt: Date;
	updatedAt: Date;
}

export type UserRole = "ADMIN" | "SUPER_ADMIN" | "ALUMNI";
