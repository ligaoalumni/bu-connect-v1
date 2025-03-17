// app/api/upload-csv/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Define a schema for validation based on your data model
// Example: If you're importing users
const StudentSchema = z.object({
	lrn: z.string().length(12),
	firstName: z.string(),
	lastName: z.string(),
	middleName: z.string().optional(),
	birthDate: z.string(),
	graduationYear: z.number(),
	studentId: z.string(),
	// Add other fields as needed
});

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
		// const validatedData = StudentSchema.parse(records[0]);

		// console.log(validatedData);

		// Start a transaction
		await prisma.$transaction(async (tx) => {
			for (const record of records) {
				try {
					// Parse the CSV record
					const parsedData = parseCSV(record);

					// Validate the record against your schema
					const validatedData = StudentSchema.parse(parsedData);

					// Check if the record already exists (using email as unique identifier)
					const existingStudent = await tx.student.findUnique({
						where: { lrn: validatedData.lrn },
					});

					if (existingStudent) {
						results.alreadyExists++;
					} else {
						// Create new user
						await tx.student.create({
							data: {
								lrn: validatedData.lrn,
								firstName: validatedData.firstName,
								lastName: validatedData.lastName,
								middleName: validatedData.middleName || "",
								birthDate: validatedData.birthDate,
								graduationYear: validatedData.graduationYear,
								studentId: validatedData.studentId,
								// Add other fields as needed
							},
						});

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

export const parseCSV = (item: any) => {
	const combinedString = Object.keys(item)[0];

	// Split the string by semicolons
	const values = item[combinedString].split(";");

	// Map the values to the correct fields
	return {
		studentId: values[0],
		firstName: values[1],
		middleName: values[2],
		lastName: values[3],
		birthDate:
			values[4] instanceof Date
				? new Date(values[4]).toISOString()
				: new Date().toISOString(),
		graduationYear: parseInt(values[5], 10), // Convert to number
		lrn: values[6],
	};
};
