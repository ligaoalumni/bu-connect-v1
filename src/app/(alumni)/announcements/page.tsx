import { getInformation, readAnnouncementsAction } from "@/actions";
import { AnnouncementsInfiniteScroll } from "@/components";
import React from "react";

export default async function Page() {
  const user = await getInformation();
  const announcements = await readAnnouncementsAction({
    pagination: {
      page: 0,
      limit: 10,
    },
    // status: ["OPEN", "COMPLETED", "CLOSED"],
  });

  return (
    <div className="py-10 px-5 md:px-10">
      <AnnouncementsInfiniteScroll
        userId={user?.id}
        defaultData={announcements.data}
      />
    </div>
  );
}
