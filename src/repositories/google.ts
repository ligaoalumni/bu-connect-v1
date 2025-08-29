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
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    await logLoginAttempt(email, false);
    redirect(
      "/register?email=" +
        email +
        "&firstName=" +
        firstName +
        "&lastName=" +
        lastName +
        (photo ? "&photo=" + photo : ""),
    );
  }

  return user;
};
