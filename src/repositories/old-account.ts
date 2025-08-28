"use server";

import { prisma } from "@/lib";
import { OldAlumniDataInput, PaginationArgs, PaginationResult } from "@/types";
import { OldAccount, Prisma } from "@prisma/client";

export const createOldAccount = async ({
  batch,
  birthDate,
  firstName,
  lastName,
  middleName,
  program,
}: OldAlumniDataInput) => {
  const isExists = await prisma.oldAccount.count({
    where: {
      AND: [
        { firstName: { contains: firstName, mode: "insensitive" } },
        { lastName: { contains: lastName, mode: "insensitive" } },
        { birthDate },
        { batch: batch },
        { program: { contains: program, mode: "insensitive" } },
      ],
    },
  });

  if (isExists || isExists) throw new Error("Old account already exists");

  const oldAccount = await prisma.oldAccount.create({
    data: {
      batch,
      birthDate,
      firstName,
      lastName,
      middleName,
      program,
    },
  });

  return oldAccount;
};

export const readOldAccounts = async ({
  filter,
  pagination,
}: PaginationArgs<never, never> = {}): Promise<
  PaginationResult<OldAccount>
> => {
  let where: Prisma.OldAccountWhereInput = {};

  if (filter && filter.toString().trim() !== "") {
    where = {
      OR: [
        { firstName: { contains: filter.toString(), mode: "insensitive" } },
        { lastName: { contains: filter.toString(), mode: "insensitive" } },
        { middleName: { contains: filter.toString(), mode: "insensitive" } },
        { program: { contains: filter.toString(), mode: "insensitive" } },
        { batch: isNaN(Number(filter)) ? undefined : Number(filter) },
      ],
    };
  }

  const oldAccounts = await prisma.oldAccount.findMany({
    where,
    skip: pagination ? pagination.limit * pagination.page : undefined,
    take: pagination ? pagination.limit : undefined,
    orderBy: { id: "desc" },
  });

  const count = await prisma.oldAccount.count({ where });

  return {
    count,
    data: oldAccounts,
    hasMore: pagination
      ? count > (pagination.page + 1) * pagination.limit
      : false,
  };
};

export const updateOldAccount = async (
  id: number,
  data: Partial<OldAlumniDataInput>,
) => {
  const isExist = await prisma.oldAccount.count({
    where: { id },
  });

  if (!isExist) throw new Error("Old account does not exist");

  const oldAccount = await prisma.oldAccount.update({
    where: { id },
    data,
  });

  return oldAccount;
};

export const deleteOldAccount = async (id: number) => {
  const oldAccount = await prisma.oldAccount.delete({
    where: { id },
  });

  return oldAccount;
};
