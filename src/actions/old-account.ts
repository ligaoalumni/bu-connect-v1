"use server";

import { decrypt } from "@/lib/session";
import {
  createOldAccount,
  deleteOldAccount,
  readOldAccount,
  readOldAccountByCurrentAccount,
  readOldAccounts,
  updateOldAccount,
} from "@/repositories";
import { OldAlumniDataInput, PaginationArgs } from "@/types";
import { cookies } from "next/headers";

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
  birthDate: Date;
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

export const deleteOldAccountAction = async (id: number) => {
  try {
    const cookieStore = await cookies();
    const session = await decrypt(cookieStore.get("session")?.value);

    if (!session) throw new Error("Unauthorized");

    return await deleteOldAccount(id);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data");
  }
};
