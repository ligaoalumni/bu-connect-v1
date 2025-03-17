import { z } from "zod";

export const EventFormSchema = z.object({
	name: z.string().nonempty("Name is required"),
	coverImg: z.string().nonempty("Cover Image is required"),
	content: z
		.string()
		.refine(
			(value) => value !== `{"type":"doc","content":[{"type":"paragraph"}]}`,
			"Content is required"
		),
	startDate: z.date(),
	endDate: z.date().optional(),
	location: z.string().nonempty("Location is required"),
	startTime: z.date(),
	endTime: z.date(),
});

export const SignupFormSchema = z
	.object({
		firstName: z
			.string()
			.min(2, { message: "Name must be at least 2 characters long." })
			.trim(),

		lastName: z
			.string()
			.min(2, { message: "Name must be at least 2 characters long." })
			.trim(),

		email: z.string().email({ message: "Please enter a valid email." }).trim(),
		password: z
			.string()
			.min(8, { message: "Be at least 8 characters long" })
			.regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
			.regex(/[0-9]/, { message: "Contain at least one number." })
			.regex(/[^a-zA-Z0-9]/, {
				message: "Contain at least one special character.",
			})
			.trim(),
		confirmPassword: z.string().trim(),
		batchYear: z
			.string()
			.min(4, { message: "Batch Year is Invalid" })
			.max(4, { message: "Batch Year is Invalid" }),
		middleName: z.string().optional(),
		lrn: z.string().min(12, { message: "LRN must be 12 characters long." }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords must match",
		path: ["confirmPassword"],
	});

// Login form schema
export const LoginFormSchema = z.object({
	email: z.string().min(1, "Email is required").email("Invalid email format"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password must be at least 8 characters"),
	rememberMe: z.boolean().optional(),
});
