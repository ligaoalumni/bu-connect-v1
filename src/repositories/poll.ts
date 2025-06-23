import { prisma } from "@/lib";
import { PaginationArgs, PaginationResult, Poll, UpdatePoll } from "@/types";
import { createPlugin } from "@fullcalendar/core/index.js";
import { Prisma } from "@prisma/client";

export const createPoll = async ({
  options,
  question,
}: {
  question: string;
  options: string[];
}) => {
  return await prisma.poll.create({
    data: {
      question,
      options: {
        createMany: {
          data: options.map((option) => ({
            content: option,
          })),
        },
      },
    },
  });
};

export const vote = async (userId: number, optionId: number) => {
  return await prisma.vote.create({
    data: {
      userId,
      optionId,
    },
  });
};

export const readPolls = async ({
  filter,
  pagination,
  order,
  orderBy,
  status,
}: PaginationArgs<Poll["status"], never>): Promise<PaginationResult<Poll>> => {
  let where: Prisma.PollWhereInput = {};

  if (filter && typeof filter === "number") {
    where = {
      id: filter,
    };
  }

  if (status) {
    where = {
      ...where,
      status: {
        in: status,
      },
    };
  }

  if (typeof filter === "string") {
    where = {
      OR: [{ question: { contains: filter, mode: "insensitive" } }],
    };
  }

  const polls = await prisma.poll.findMany({
    where,
    skip: pagination ? pagination.limit * pagination.page : undefined,
    take: pagination ? pagination.limit : undefined,
    orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
    include: {
      options: {
        include: {
          _count: {
            select: {
              votes: true,
            },
          },
          votes: {
            select: {
              userId: true,
            },
          },
        },
      },
    },
  });

  const count = await prisma.poll.count({ where });

  return {
    count,
    hasMore: polls.length === pagination?.limit,
    data: polls.map((poll) => ({
      ...poll,
      votes: poll.options.reduce((acc, option) => acc + option._count.votes, 0),
    })),
  };
};

export const readPoll = async (id: number) => {
  return await prisma.poll.findUnique({
    where: {
      id,
    },
    include: {
      options: {
        include: {
          votes: {
            select: {
              id: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  batch: true,
                  avatar: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const updatePoll = async (
  id: number,
  { options, question }: UpdatePoll,
) => {
  await prisma.$transaction(async (tx) => {
    options.forEach(async (option) => {
      await tx.option.upsert({
        where: {
          id: option.id,
        },
        update: {
          content: option.content,
        },
        create: {
          content: option.content,
          pollId: id,
        },
      });
    });

    await tx.poll.update({
      where: {
        id,
      },
      data: {
        question,
      },
    });
  });
};

export const updatePollStatus = async (id: number, status: Poll["status"]) => {
  await prisma.poll.update({
    data: {
      status,
    },
    where: {
      id,
    },
  });
};
