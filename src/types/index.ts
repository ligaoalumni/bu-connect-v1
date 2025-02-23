import { LoginFormSchema, SignupFormSchema } from "@/lib/definitions";
import { z } from "zod";

export * from "./alumni";
export * from "./user";

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
export type SignUpFormData = z.infer<typeof SignupFormSchema>;
