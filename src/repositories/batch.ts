"use server";
import { prisma } from "@/lib";
import { Batch, PaginationArgs, PaginationResult } from "@/types";

export const readBatches = async ({
  pagination,
  orderBy,
  order,
}: PaginationArgs<never, never>): Promise<PaginationResult<Batch>> => {
  const batches = await prisma.batch.findMany({
    skip: pagination ? pagination.limit * pagination.page : undefined,
    take: pagination ? pagination.limit : undefined,
    orderBy: orderBy ? { [orderBy]: order || "desc" } : { batch: "desc" },
  });

  const batchesWithStudentCounts = await Promise.all(
    batches.map(async (batch) => {
      const students = await prisma.user.count({
        where: {
          batch: batch.batch,
        },
      });

      return {
        id: batch.id,
        batch: batch.batch,
        images: batch.images,
        students,
      };
    }),
  );

  const count = await prisma.batch.count();

  return {
    count,
    hasMore: batches.length === pagination?.limit,
    data: batchesWithStudentCounts,
  };
};

export const createBatch = async (batchNumber: number) => {
  return await prisma.batch.create({
    data: {
      batch: batchNumber,
    },
  });
};

export const readBatch = async (batchNumber: number) => {
  const batch = await prisma.batch.findFirst({
    where: {
      batch: batchNumber,
    },
  });

  if (!batch) return null;

  const students = await prisma.user.count({
    where: {
      batch: batchNumber,
    },
  });

  return { ...batch, students };
};

export const uploadBatchImages = async ({
  batch,
  images,
}: {
  batch: number;
  images: string[];
}) => {
  return await prisma.batch.update({
    where: {
      batch,
    },
    data: {
      images: {
        push: images,
      },
    },
  });
};
