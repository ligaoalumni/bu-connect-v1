import { prisma } from "@/lib";
import { OldAccount } from "@prisma/client";
import { parse } from "csv-parse/sync";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  studentId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().optional(),
  birthDate: z.string(),
  program: z.string(),
  batch: z.number(),
});

const parseCSV = (item: any) => {
  const values = Object.values(item);

  // Map the values to the correct fields
  return {
    studentId: values[0],
    firstName: values[1],
    lastName: values[2],
    middleName: values[3],
    birthDate: new Date(String(values[4])).toISOString(),
    program: values[5],
    batch: Number(values[6]), // Convert to number
  };
};

export async function POST(request: NextRequest) {
  try {
    // Check if the request is multipart form data
    if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json(
        { message: "Content type must be multipart/form-data" },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 },
      );
    }

    // Check file type
    if (file.type !== "text/csv") {
      return NextResponse.json(
        { message: "File must be a CSV" },
        { status: 400 },
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
        { status: 400 },
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

    const alumni: OldAccount[] = [];

    // Start a transaction
    await prisma.$transaction(async (tx) => {
      for (const record of records) {
        try {
          // Parse the CSV record

          const parsedData = parseCSV(record);

          // Validate the record against your schema
          const validatedData = formSchema.parse(parsedData);

          // Check if the record already exists (using email as unique identifier)
          const existingStudent = await tx.oldAccount.findFirst({
            where: {
              AND: [
                { firstName: validatedData.firstName },
                { lastName: validatedData.lastName },
                { birthDate: new Date(validatedData.birthDate) },
                { batch: validatedData.batch },
                { program: validatedData.program },
              ],
            },
          });

          if (existingStudent) {
            results.alreadyExists++;
          } else {
            // Create new user
            const newAccount = await tx.oldAccount.create({
              data: validatedData,
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
              }`,
            );
          } else if (error instanceof Error) {
            results.errors.push(
              `Row ${results.processed + results.failed}: ${error.message}`,
            );
          } else {
            results.errors.push(
              `Row ${results.processed + results.failed}: Unknown error`,
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
      { status: 500 },
    );
  }
}
