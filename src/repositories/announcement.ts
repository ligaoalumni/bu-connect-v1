"use server";

import {
  AnnouncementCommentWithUser,
  Pagination,
  PaginationArgs,
  PaginationResult,
} from "@/types";
import { Announcement, NotificationType, Prisma } from "@prisma/client";
import slug from "unique-slug";
import { createNotifications } from "./notifications";
import { getNotificationMessage, prisma } from "@/lib";
import { getAdmins, getUsersId } from "./user";

export const createAnnouncement = async ({
  content,
  image,
  title,
  id,
}: Pick<Announcement, "title" | "content"> & {
  image?: string;
  id: number;
}) => {
  const timestamp = Date.now(); // current timestamp
  const randomPart = Math.random().toString(36).substring(2, 10); // random string (base 36)
  const name = title.toLowerCase().replace(/ /g, "-");
  const generatedSlug = slug(name);

  const newAnnouncement = await prisma.announcement.create({
    data: {
      title,
      image,
      content,
      slug: `${name}-${timestamp}-${randomPart}-${generatedSlug}`,
      createdBy: {
        connect: {
          id,
        },
      },
    },
  });

  const usersId = await getUsersId();
  const link = `/announcements/${newAnnouncement.slug}`;

  const notifications = usersId.map((id) => ({
    userId: id,
    message: getNotificationMessage("ANNOUNCEMENT"),
    link,
    type: "ANNOUNCEMENT" as NotificationType,
  }));

  await createNotifications(notifications);

  return newAnnouncement;
};

export const updateAnnouncement = async (
  toUpdate: string,
  values: Partial<Pick<Announcement, "title" | "content" | "image">>,
) => {
  return await prisma.announcement.update({
    where: {
      slug: toUpdate,
    },
    data: values,
  });
};

export const deleteAnnouncement = async (toDelete: string, userId: number) => {
  return await prisma.announcement.delete({
    where: {
      slug: toDelete,
      createdById: userId,
    },
  });
};

export const readAnnouncements = async ({
  filter,
  order,
  orderBy,
  pagination,
  id,
}: PaginationArgs<never, never> & { id?: number } = {}) => {
  let where: Prisma.AnnouncementWhereInput = {};

  if (filter && typeof filter === "number") {
    where = {
      id: filter,
    };
  }

  if (typeof filter === "string" && filter !== "POPULAR") {
    where = {
      OR: [{ title: { contains: filter, mode: "insensitive" } }],
    };
  }

  if (id) {
    where = {
      AND: [where, { createdBy: { id } }],
    };
  }

  const records = await prisma.announcement.findMany({
    where,
    skip: pagination ? pagination.limit * pagination.page : undefined,
    take: pagination ? pagination.limit : undefined,

    orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
    include: {
      createdBy: true,
      _count: {
        select: {
          comments: true,
          likedBy: true,
        },
      },
    },
  });

  const count = await prisma.announcement.count({ where });

  let data = records.map((record) => ({
    ...record,
  }));

  if (typeof filter === "string" && filter === "POPULAR") {
    data = records.sort((a, b) => b._count.likedBy - a._count.likedBy);
  }
  return {
    count,
    hasMore: records.length === pagination?.limit,
    data,
  };
};

export const readAnnouncement = async (slug: string) => {
  return await prisma.announcement.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          comments: true,
          likedBy: true,
        },
      },
      createdBy: true,
      likedBy: {
        select: {
          id: true,
        },
      },
    },
  });
};

export const writeAnnouncementComment = async ({
  announcementId,
  comment,
  userId,
}: {
  announcementId: number;
  comment: string;
  userId: number;
}) => {
  const newComment = await prisma.announcementComment.create({
    data: {
      announcementId,
      comment,
      commentById: userId,
    },
    include: {
      announcement: {
        select: {
          comments: {
            select: {
              commentById: true,
            },
          },
        },
      },
    },
  });

  if (!newComment) {
    throw new Error("Failed to create comment");
  }

  const { announcement } = newComment;

  const ids = announcement.comments
    .map((comment) => comment.commentById)
    .filter((ids) => ids !== userId);

  const uniqueIds = [...new Set(ids)];

  const link = `/announcements/${announcementId}#comment-${newComment.id}`;

  const notifications = uniqueIds.map((id) => ({
    userId: id,
    message: getNotificationMessage("ANNOUNCEMENT_COMMENT"),
    link,
    type: "ANNOUNCEMENT_COMMENT" as NotificationType,
  }));

  await createNotifications(notifications);
};

export const readAnnouncementComments = async ({
  pagination,
  announcementId,
}: {
  pagination?: Pagination;
  announcementId: number;
}): Promise<PaginationResult<AnnouncementCommentWithUser>> => {
  const records = await prisma.announcementComment.findMany({
    where: {
      announcementId,
    },
    include: {
      commentBy: {
        select: {
          id: true,
          avatar: true,
          firstName: true,
          lastName: true,
          batch: true,
        },
      },
    },
    skip: pagination ? pagination.limit * pagination.page : undefined,
    take: pagination ? pagination.limit : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  const count = await prisma.announcementComment.count({
    where: {
      announcementId,
    },
  });

  return {
    count,
    hasMore: records.length === pagination?.limit,
    data: records.map((record) => ({
      ...record,
    })),
  };
};

export const likeAnnouncement = async ({
  id,
  userId,
}: {
  id: number;
  userId: number;
}) => {
  const announcement = await prisma.announcement.update({
    where: {
      id,
    },
    data: {
      likedBy: {
        connect: {
          id: userId,
        },
      },
    },
  });

  if (!announcement) throw new Error("Failed to like announcement");
  const users = await getAdmins();

  const link = `/announcements/${announcement.slug}`;

  const notifications = users.map((user) => ({
    userId: user.id,
    message: getNotificationMessage("LIKE_ANNOUNCEMENT"),
    link,
    type: "LIKE_ANNOUNCEMENT" as NotificationType,
  }));

  await createNotifications(notifications);

  return announcement;
};

export const unlikeAnnouncement = async ({
  id,
  userId,
}: {
  id: number;
  userId: number;
}) => {
  return await prisma.announcement.update({
    where: {
      id,
    },
    data: {
      likedBy: {
        disconnect: {
          id: userId,
        },
      },
    },
  });
};
