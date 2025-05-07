import prisma from "@/lib/prisma";
import { PaginationArgs } from "@/types";

export const readBatches = async ({
	pagination,
	orderBy,
	order,
}: PaginationArgs<never, never>) => {
	const batches = await prisma.batch.findMany({
		skip: pagination ? pagination.limit * pagination.page : undefined,
		take: pagination ? pagination.limit : undefined,
		orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
	});

	const count = await prisma.batch.count();

	return {
		count,
		hasMore: batches.length === pagination?.limit,
		data: batches,
	};
};
