"use server";

import { prisma } from "@/lib";

export const generatedUpdateAlumniReport = async (batch?: number) => {
  const data = await prisma.user.findMany({
    where: {
      batch,
      role: "ALUMNI",
      // status: "ACTIVE",
    },
    select: {
      firstName: true,
      lastName: true,
      batch: true,
      course: true,
      company: true,
      currentOccupation: true,
      jobTitle: true,
      industry: true,
      postStudyUniversity: true,
      years: true,
    },
  });

  return data.map((user) => {
    return {
      name: `${user.firstName} ${user.lastName}`,
      batch: user.batch || "-",
      course: user.course || "-",
      company: user.company || "-",
      currentOccupation: user.currentOccupation || "-",
      jobTitle: user.jobTitle || "-",
      industry: user.industry || "-",
      postStudyUniversity: user.postStudyUniversity || "-",
      years: user.years || "-",
    };
  });
};
