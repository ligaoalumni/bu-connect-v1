import { prisma, shuffleArray } from "@/lib";
import { Pagination } from "@/types";
import { Poll, Recruitment } from "@prisma/client";

export const readHighlights = async ({
  pagination,
}: { pagination?: Pagination } = {}) => {
  const polls = await prisma.poll.findMany({
    where: {
      status: "OPEN",
    },
    skip: pagination ? pagination.limit * pagination.page : undefined,
    take: pagination ? pagination.limit : undefined,
  });

  const recruitments = await prisma.recruitment.findMany({
    where: {
      status: "OPEN",
    },
    skip: pagination ? pagination.limit * pagination.page : undefined,
    take: pagination ? pagination.limit : undefined,
  });

  let highlights: Array<Poll | Recruitment> = [...polls, ...recruitments];

  highlights = shuffleArray(highlights);

  highlights = highlights.slice(
    0,
    pagination ? pagination.limit : highlights.length,
  );

  return highlights;
};
