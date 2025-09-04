"use server";

import { prisma } from "@/lib";

export const loginWithGoogle = async ({
  email,
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
