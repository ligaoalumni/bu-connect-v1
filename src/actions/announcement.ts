"use server";

import { decrypt } from "@/lib/session";
import {
  createAnnouncement,
  deleteAnnouncement,
  likeAnnouncement,
  readAnnouncement,
  readAnnouncementComments,
  readAnnouncements,
  unlikeAnnouncement,
  updateAnnouncement,
  writeAnnouncementComment,
} from "@/repositories";
import { Pagination, PaginationArgs } from "@/types";
import { Announcement } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const createAnnouncementAction = async ({
  content,
  title,
  image,
}: Pick<Announcement, "content" | "title"> & { image?: string }) => {
  try {
    const announcement = await createAnnouncement({
      content,
      title,
      image,
    });

    if (!announcement) {
      throw new Error("Announcement creation failed");
    }

    revalidatePath("/admin/announcements");

    return announcement;
  } catch (err) {
    console.error("Error creating announcement:", err);
    throw new Error(
      err instanceof Error
        ? err.message
        : "Internal Server Error, Please contact tech support.",
    );
  }
};

export const updateAnnouncementAction = async (
  slug: string,
  data: Partial<Pick<Announcement, "title" | "content" | "image">>,
) => {
  try {
    const updatedAnnouncement = await updateAnnouncement(slug, data);

    if (!updatedAnnouncement) {
      throw new Error("Updating announcement failed!");
    }

    revalidatePath("/admin/announcements");
    return updatedAnnouncement;
  } catch (err) {
    console.error("Error creating announcement:", err);
    throw new Error(
      err instanceof Error
        ? err.message
        : "Internal Server Error, Please contact tech support.",
    );
  }
};

export const deleteAnnouncementAction = async (slug: string) => {
  try {
    await deleteAnnouncement(slug);

    revalidatePath("/admin/announcements");
  } catch (err) {
    console.error("Error creating announcement:", err);
    throw new Error(
      err instanceof Error
        ? err.message
        : "Internal Server Error, Please contact tech support.",
    );
  }
};

export const readAnnouncementsAction = async (
  args: PaginationArgs<never, never> = {},
) => {
  try {
    return await readAnnouncements(args);
  } catch (err) {
    console.error("Error creating announcement:", err);
    throw new Error(
      err instanceof Error
        ? err.message
        : "Internal Server Error, Please contact tech support.",
    );
  }
};
export const readAnnouncementAction = async (slug: string) => {
  try {
    return await readAnnouncement(slug);
  } catch (err) {
    console.error("Error creating announcement:", err);
    throw new Error(
      err instanceof Error
        ? err.message
        : "Internal Server Error, Please contact tech support.",
    );
  }
};

export const writeAnnouncementCommentAction = async ({
  announcementId,
  comment,
}: {
  announcementId: number;
  comment: string;
}) => {
  try {
    const cookieStore = await cookies();

    const session = await decrypt(cookieStore.get("session")?.value);

    if (!session?.id) throw new Error("Unauthorized");

    return await writeAnnouncementComment({
      announcementId,
      comment,
      userId: session?.id,
    });
  } catch (err) {
    console.error("Error creating announcement:", err);
    throw new Error(
      err instanceof Error
        ? err.message
        : "Internal Server Error, Please contact tech support.",
    );
  }
};

export const readAnnouncementCommentsAction = async ({
  pagination,
  announcementId,
}: {
  pagination?: Pagination;
  announcementId: number;
}) => {
  try {
    return await readAnnouncementComments({ pagination, announcementId });
  } catch (err) {
    console.error("Error creating announcement:", err);
    throw new Error(
      err instanceof Error
        ? err.message
        : "Internal Server Error, Please contact tech support.",
    );
  }
};

export const likeAnnouncementAction = async (id: number, slug: string) => {
  try {
    const cookieStore = await cookies();
    const session = await decrypt(cookieStore.get("session")?.value);

    if (!session?.id) throw new Error("Unauthorized");

    await likeAnnouncement({ id, userId: session.id });

    revalidatePath(`/announcements/${slug}`);
  } catch (err) {
    console.error("Error creating announcement:", err);
    throw new Error(
      err instanceof Error
        ? err.message
        : "Internal Server Error, Please contact tech support.",
    );
  }
};

export const unlikeAnnouncementAction = async (id: number, slug: string) => {
  try {
    const cookieStore = await cookies();
    const session = await decrypt(cookieStore.get("session")?.value);

    if (!session?.id) throw new Error("Unauthorized");

    await unlikeAnnouncement({ id, userId: session.id });

    revalidatePath(`/announcements/${slug}`);
  } catch (err) {
    console.error("Error creating announcement:", err);
    throw new Error(
      err instanceof Error
        ? err.message
        : "Internal Server Error, Please contact tech support.",
    );
  }
};
