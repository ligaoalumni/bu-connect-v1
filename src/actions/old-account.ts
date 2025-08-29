"use server";

import {
  createOldAccount,
  readOldAccount,
  readOldAccounts,
} from "@/repositories";
import { OldAlumniDataInput, PaginationArgs } from "@/types";

export const createOldAccountAction = async (data: OldAlumniDataInput) => {
  try {
    return await createOldAccount(data);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data");
  }
};

export const readOldAccountsAction = async (
  data: PaginationArgs<never, never>,
) => {
  try {
    return await readOldAccounts(data);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data");
  }
};

export const readOldAccountAction = async (id: number | string) => {
  try {
    const data = await readOldAccount(id);
    if (!data) throw new Error("Old account not found");
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data");
  }
};
