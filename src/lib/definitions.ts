import { z } from "zod";

export const EventFormSchema = z.object({
  name: z.string().nonempty("Name is required"),
  coverImg: z.string().nonempty("Cover Image is required"),
  content: z
    .string()
    .refine(
      (value) => value !== `{"type":"doc","content":[{"type":"paragraph"}]}`,
      "Content is required",
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
    batchYear: z.string().min(1, "Batch is required"),
    middleName: z.string().optional(),

    birthDate: z.string().min(1, "Birth date is required"),
    program: z.string().min(1, "Program is required"),
    batch: z.string().min(1, "Batch is required"),
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
  batch: z.coerce
    .number()
    .int()
    .min(2000, { message: "Year must be at least 2000" })
    .max(2100, { message: "Year must be at most 2100" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  course: z.string().min(1, { message: "Course is required" }),
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
  avatar: z.string(),
  bio: z.string().optional(),

  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  middleName: z.string().optional(),

  nationality: z.string(),
  religion: z.string(),

  address: z
    .object({
      lat: z.number(),
      lng: z.number(),
      address: z.string(),
    })
    .optional(), // Make it optional so existing profiles without address still work

  gender: z.string(),
  contactNumber: z.string(),
  birthDate: z.string().min(1, { message: "Birth date is required" }),

  // EDUCATION INFO
  studentId: z.string(),
  course: z.string(),
  batch: z.coerce
    .string()
    .regex(/[0-9]/, { message: "Contain at least one number." }),

  // JOB INFO
  company: z.string(),
  currentOccupation: z.string(),
  jobTitle: z.string(),
});

export const AdminProfileSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  middleName: z.string().optional(),

  nationality: z.string(),
  religion: z.string(),
  gender: z.string(),
  address: z
    .object({
      lat: z.number(),
      lng: z.number(),
      address: z.string(),
    })
    .optional(), // Make it optional so existing profiles without address still work

  contactNumber: z.string(),
  avatar: z.string(),
  birthDate: z.string().min(1, { message: "Birth date is required" }),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current Password is required!"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const AnnouncementSchema = z.object({
  title: z.string().nonempty("Title is required"),
  content: z.string().nonempty("Content is required"),
});

export const JobSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  jobTitle: z.string().min(1, { message: "Job title is required" }),
  companyName: z.string().min(1, { message: "Company name is required" }),
  employmentType: z.string().min(1, { message: "Employment type is required" }),
  location: z.string().min(1, { message: "Location type is required" }),
  jobDescription: z
    .string()
    .min(1, { message: "Job description type is required" }),
});

export const RecruitmentSchema = z.object({
  eventTitle: z.string().min(1, "Title is required"),
  recruiting: z.string().min(1, "Recruiting is required"),
  allowedBatches: z
    .array(z.number())
    .min(1, "At least one batch must be selected"),
  industry: z.string().min(1, "Industry is required"),
  topics: z.array(z.string()).min(1, "At least one topic is required"),
  date: z.date({
    required_error: "Date is required",
  }),
});
