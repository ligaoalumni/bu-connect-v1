"use server";

import { prisma } from "@/lib";
import { redirect } from "next/navigation";
import { logLoginAttempt } from "./login-logs";

export const loginWithGoogle = async ({
  email,
  firstName,
  lastName,
  photo,
}: {
  email: string;
  photo?: string;
  firstName: string;
  lastName: string;
}) => {
  return await prisma.user.findFirst({
    where: { email },
  });
};
