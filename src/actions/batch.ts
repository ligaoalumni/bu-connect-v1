import { readBatches } from "@/repositories";
import { Pagination } from "@/types";

export const readBatchesAction = async ({
	pagination,
}: {
	pagination?: Pagination;
}) => {
	try {
		return await readBatches({ pagination });
	} catch {
		throw new Error("Failed to fetch batches");
	}
};
