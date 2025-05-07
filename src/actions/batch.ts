import { createBatch, readBatch, readBatches } from "@/repositories";
import { Pagination } from "@/types";

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

		return await createBatch(batchNumber);
	} catch {
		throw new Error("Failed to create batch");
	}
};
