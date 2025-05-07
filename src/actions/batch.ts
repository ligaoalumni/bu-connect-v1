import { createBatch, readBatch, readBatches } from "@/repositories";
import { Pagination } from "@/types";
import { revalidatePath } from "next/cache";

export const readBatchesAction = async ({
	pagination,
}: {
	pagination?: Pagination;
} = {}) => {
	try {
		return await readBatches({ pagination });
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
	} catch {
		throw new Error("Failed to create batch");
	}
};
