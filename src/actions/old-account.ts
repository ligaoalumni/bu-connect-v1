"use server";

import {
  createOldAccount,
  readOldAccount,
  readOldAccountByCurrentAccount,
  readOldAccounts,
  updateOldAccount,
} from "@/repositories";
import { OldAlumniDataInput, PaginationArgs } from "@/types";
import { revalidatePath } from "next/cache";

export const createOldAccountAction = async (data: OldAlumniDataInput) => {
  try {
    return await createOldAccount(data);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data");
  }
};

export const readOldAccountsAction = async (
  data: PaginationArgs<never, never> & {
    batch?: string;
  },
) => {
  try {
    return await readOldAccounts(data);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data");
  }
};

export const readOldAccountAction = async (id: string) => {
  try {
    return await readOldAccount(id);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data");
  }
};

export const updateOldAccountAction = async (
  id: number,
  data: Partial<OldAlumniDataInput>,
) => {
  try {
    console.log(data, "qqq");

    const updatedData = await updateOldAccount(id, data);

    if (!updatedData) throw new Error("Failed to update data!");

    return updatedData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data");
  }
};

export const readOldAccountByCurrentAccountAction = async (args: {
  birthDate: string;
  batch: number;
  program: string;
  firstName: string;
}) => {
  try {
    return await readOldAccountByCurrentAccount(args);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data");
  }
};
