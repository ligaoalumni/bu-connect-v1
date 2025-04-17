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
			.regex(/^\d+$/, { message: "Batch Year must only contain digits." })
			.length(4, { message: "Batch Year must be exactly 4 digits." }),
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

export const AlumniSchema = z.object({
	studentId: z.string().min(1, { message: "Student ID is required" }),
	firstName: z.string().min(1, { message: "First name is required" }),
	lastName: z.string().min(1, { message: "Last name is required" }),
	middleName: z.string().optional(),
	birthDate: z.string().min(1, { message: "Birth date is required" }),
	graduationYear: z.coerce
		.number()
		.int()
		.min(2000, { message: "Year must be at least 2000" })
		.max(2100, { message: "Year must be at most 2100" }),
	lrn: z.string().length(12, { message: "LRN must be exactly 12 characters" }),
	strand: z.string().optional(),
	educationLevel: z.string().min(1, { message: "Education level is required" }),
});

export const AdminSchema = z.object({
	firstName: z
		.string()
		.min(2, { message: "First name must be at least 2 characters" }),
	middleName: z.string().optional(),
	lastName: z
		.string()
		.min(2, { message: "Last name must be at least 2 characters" }),
	email: z.string().email({ message: "Please enter a valid email address" }),
	role: z.enum(["ADMIN", "SUPER_ADMIN"]),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" }),
	passwordLength: z.number().min(8).max(32),
	includeUppercase: z.boolean().default(true),
	includeLowercase: z.boolean().default(true),
	includeNumbers: z.boolean().default(true),
	includeSymbols: z.boolean().default(true),
});

export const ProfileSchema = z.object({
	firstName: z.string().min(1, { message: "First name is required" }),
	lastName: z.string().min(1, { message: "Last name is required" }),
	middleName: z.string().optional(),
	birthDate: z.string().min(1, { message: "Birth date is required" }),
	contactNumber: z.string(),
	address: z.string(),
	religion: z.string(),
	nationality: z.string(),
	gender: z.string(),
	avatar: z.string(),

	// POST GRADUATION
	furtherEducation: z.string(),
	course: z.string(),
	company: z.string(),
	schoolName: z.string(),
	occupation: z.string(),
	jobTitle: z.string(),
});

export const AdminProfileSchema = z.object({
	firstName: z.string().min(1, { message: "First name is required" }),
	lastName: z.string().min(1, { message: "Last name is required" }),
	middleName: z.string().optional(),

	nationality: z.string(),
	religion: z.string(),
	gender: z.string(),
	address: z.string(),
	contactNumber: z.string(),
	avatar: z.string(),
	birthDate: z.string().min(1, { message: "Birth date is required" }),
});
