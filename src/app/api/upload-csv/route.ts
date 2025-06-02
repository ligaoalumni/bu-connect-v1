// app/api/upload-csv/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { z } from "zod";
import { Gender, User } from "@prisma/client";
import { hash } from "bcryptjs";
import { getMonth, getYear } from "date-fns";
import { prisma, generateEmailHTML } from "@/lib";
import { transporter } from "@/lib/email";

// Define a schema for validation based on your data model
// Example: If you're importing users
const AlumniSchema = z.object({
	studentId: z.string(),
	email: z.string().email(),
	lastName: z.string(),
	firstName: z.string(),
	middleName: z.string().optional(),
	birthDate: z.string(),
	batch: z.number(),
	course: z.string(),
	gender: z.string(),
});

const parseCSV = (item: any) => {
	const values = Object.values(item);

	// Map the values to the correct fields
	return {
		studentId: values[0],
		email: values[1],
		firstName: values[2],
		middleName: values[3],
		lastName: values[4],
		birthDate: new Date(String(values[5])).toISOString(),
		gender: values[6],
		batch: Number(values[7]), // Convert to number
		course: values[8],
	};
};

export async function POST(request: NextRequest) {
	try {
		// Check if the request is multipart form data
		if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
			return NextResponse.json(
				{ message: "Content type must be multipart/form-data" },
				{ status: 400 }
			);
		}

		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json(
				{ message: "No file provided" },
				{ status: 400 }
			);
		}

		// Check file type
		if (file.type !== "text/csv") {
			return NextResponse.json(
				{ message: "File must be a CSV" },
				{ status: 400 }
			);
		}

		// Read file content
		const fileBuffer = await file.arrayBuffer();
		const fileContent = Buffer.from(fileBuffer).toString();

		// Parse CSV
		const records = parse(fileContent, {
			// columns: true,
			columns: true,
			trim: true,
		});

		if (!records.length) {
			return NextResponse.json(
				{ message: "CSV file is empty" },
				{ status: 400 }
			);
		}

		// Process records
		const results = {
			processed: 0,
			failed: 0,
			alreadyExists: 0,
			errors: [] as string[],
		};
		// const validatedData = AlumniSchema.parse(records[0]);

		// console.log(validatedData);

		const alumni: User[] = [];

		// Start a transaction
		await prisma.$transaction(async (tx) => {
			for (const record of records) {
				try {
					// Parse the CSV record

					const parsedData = parseCSV(record);

					// Validate the record against your schema
					const validatedData = AlumniSchema.parse(parsedData);

					// Check if the record already exists (using email as unique identifier)
					const existingStudent = await tx.user.findUnique({
						where: { email: validatedData.email },
					});

					if (existingStudent) {
						results.alreadyExists++;
					} else {
						const year = getYear(validatedData.birthDate);
						const month = String(
							getMonth(validatedData.birthDate) + 1
						).padStart(2, "0"); // Month is 0-indexed in JavaScript
						const day = new Date(validatedData.birthDate)
							.getDate()
							.toString()
							.padStart(2, "0"); // Pad day with leading zero if needed
						const password = `${validatedData.lastName.toLowerCase()}${year}${month}${day}`;

						const hashedPassword = await hash(password, 10);

						// Create new user
						const newAccount = await tx.user.create({
							data: {
								studentId: validatedData.studentId,
								email: validatedData.email,
								firstName: validatedData.firstName,
								lastName: validatedData.lastName,
								middleName: validatedData.middleName || "",
								birthDate: validatedData.birthDate,
								batch: validatedData.batch,
								gender: validatedData.gender as Gender,
								course: validatedData.course,
								password: hashedPassword,
								role: "ALUMNI",
							},
						});

						alumni.push(newAccount);
						results.processed++;
					}
				} catch (error) {
					results.failed++;
					if (error instanceof z.ZodError) {
						results.errors.push(
							`Row ${results.processed + results.failed}: Validation error - ${
								error.errors[0].message
							}`
						);
					} else if (error instanceof Error) {
						results.errors.push(
							`Row ${results.processed + results.failed}: ${error.message}`
						);
					} else {
						results.errors.push(
							`Row ${results.processed + results.failed}: Unknown error`
						);
					}
				}
			}
		});

		const mailOptions = {
			from: process.env.EMAIL,
			sender: {
				name: "LNHS | Alumni Association",
				address: process.env.EMAIL!,
			},
			to: alumni.map((acc) => acc.email).join(", "),
			subject: "Account Credentials",
			html: generateEmailHTML(`
				<p>Your alumni account has been created. Below are your login credentials:</p>

				<div class="credentials">
					<p><strong>Email:</strong> Your BU email</p>
					<p><strong>Password:</strong> Your initial password is your last name (all lowercase) followed by your birthdate in the format YYYYMMDD.</p>
				</div>

				<p><em>For example, if your last name is "Garcia" and your birthdate is January 15, 1990, your password would be "garcia19900115".</em></p>

				<p class="warning">Important: Please change your password immediately after your first login for security reasons.</p>

				<p>To access your account, please click the button below:</p>

				<a href="${process.env.CLIENT_URL}/login" target="_blank" class="button">Login to Your Account</a>

				<p>If you have any questions or need assistance, please contact our support team.</p>

				<p>Thank you,<br>The Team</p>
			`),
		};

		await transporter.sendMail(mailOptions);

		return NextResponse.json({
			message: "CSV processed successfully",
			processed: results.processed,
			failed: results.failed,
			alreadyExists: results.alreadyExists,
			errors: results.errors.slice(0, 10), // Return first 10 errors only
		});
	} catch (error) {
		console.error("CSV upload error:", error);
		return NextResponse.json(
			{
				message:
					error instanceof Error ? error.message : "Failed to process CSV",
			},
			{ status: 500 }
		);
	}
}
