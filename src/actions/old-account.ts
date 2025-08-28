"use server";

import { createOldAccount, readOldAccounts } from "@/repositories";
import { OldAlumniDataInput, PaginationArgs } from "@/types";

export const createOldAccountAction = async (data: OldAlumniDataInput) => {
  try {
    return await createOldAccount(data);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch polls");
  }
};

export const readOldAccountsAction = async (
  data: PaginationArgs<never, never>,
) => {
  try {
    return await readOldAccounts(data);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch polls");
  }
};
