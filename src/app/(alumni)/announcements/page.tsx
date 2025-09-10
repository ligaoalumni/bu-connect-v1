import { readAnnouncementsAction } from "@/actions";
import { AnnouncementsInfiniteScroll } from "@/components";
import React from "react";

export default async function Page() {
  const announcements = await readAnnouncementsAction({
    pagination: {
      page: 0,
      limit: 10,
    },
    // status: ["OPEN", "COMPLETED", "CLOSED"],
  });

  return (
    <div className="mt-10 px-5 md:px-10">
      <AnnouncementsInfiniteScroll defaultData={announcements.data} />
    </div>
  );
}
