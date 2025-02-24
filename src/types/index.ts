import {
	EventFormSchema,
	LoginFormSchema,
	SignupFormSchema,
} from "@/lib/definitions";
import { z } from "zod";

export * from "./alumni";
export * from "./user";
export * from "./event";

export interface PaginationResult<T> {
	count: number;
	data: T[];
	hasMore: boolean;
}

export type PaginationArgs = {
	filter: string | number;
	pagination?: {
		limit: number;
		page: number;
	};
};

export type FormState =
	| {
			errors?: {
				name?: string[];
				email?: string[];
				password?: string[];
			};
			message?: string;
	  }
	| undefined;

export type SessionPayload = {
	id: number;
	role: UserRole;
	expiresAt: Date;
	email: string;
};

export type UserRole = "ADMIN" | "SUPER_ADMIN" | "ALUMNI";

export type LoginFormData = z.infer<typeof LoginFormSchema>;
export type EventFormData = z.infer<typeof EventFormSchema>;
export type SignUpFormData = z.infer<typeof SignupFormSchema>;
