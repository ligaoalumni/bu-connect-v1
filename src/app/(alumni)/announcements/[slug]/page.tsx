import { readAnnouncementAction } from "@/actions";
import { notFound } from "next/navigation";
import React from "react";
import Announcement from "../__components/announcement";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const announcement = await readAnnouncementAction(slug);

  if (!announcement) return notFound();

  return (
    <div className="mt-10 px-5 md:px-10">
      <Announcement
        createdBy={{
          batch: announcement.createdBy.batch,
          firstName: announcement.createdBy.firstName,
          lastName: announcement.createdBy.lastName,
          id: announcement.createdBy.id,
          role: announcement.createdBy.role,
        }}
        backToPath="/announcements/list"
        announcement={announcement}
        comments={announcement._count.comments}
        likedByIds={announcement.likedBy.map((like) => like.id)}
        likes={announcement._count.likedBy}
      />
    </div>
  );
}
