"use server";

import {
  createBatch,
  readBatch,
  readBatches,
  uploadBatchImages,
} from "@/repositories";
import { PaginationArgs } from "@/types";
import { revalidatePath } from "next/cache";

export const readBatchesAction = async (
  args: PaginationArgs<never, never> = {},
) => {
  try {
    return await readBatches(args);
  } catch {
    throw new Error("Failed to fetch batches");
  }
};

export const createBatchAction = async (batchNumber: number) => {
  try {
    const isBatchExists = await readBatch(batchNumber);
    if (isBatchExists) {
      throw new Error("Batch already exists");
    }

    const batch = await createBatch(batchNumber);

    revalidatePath("/admin/batches-gallery");

    return batch;
  } catch (error) {
    console.log(error, "qq");
    throw new Error(
      error instanceof Error ? error.message : "Failed to create batch",
    );
  }
};

export const uploadBatchImagesAction = async (
  batchNumber: number,
  images: string[],
) => {
  try {
    const isBatchExists = await readBatch(batchNumber);
    if (!isBatchExists) {
      throw new Error("Batch does not exist");
    }
    const batch = await uploadBatchImages({
      batch: batchNumber,
      images,
    });

    return batch;
  } catch (error) {
    console.log(error, "qq");
    throw new Error(
      error instanceof Error ? error.message : "Failed to create batch",
    );
  }
};

export const readBatchAction = async (batchNumber: number) => {
  try {
    return await readBatch(batchNumber);
  } catch (error) {
    console.log(error, "qq");
    throw new Error(
      error instanceof Error ? error.message : "Failed to create batch",
    );
  }
};
