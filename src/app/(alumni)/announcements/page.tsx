import { getInformation, readAnnouncementsAction } from "@/actions";
import { LoaderComponent } from "@/components";
import dynamic from "next/dynamic";
import React from "react";

const AnnouncementsInfiniteScroll = dynamic(
  () => import("@/components").then((mod) => mod.AnnouncementsInfiniteScroll),
  {
    loading: LoaderComponent,
  },
);

export default async function Page() {
  const user = await getInformation();
  const announcements = await readAnnouncementsAction({
    pagination: {
      page: 0,
      limit: 10,
    },
    order: "desc",
    orderBy: "createdAt",
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
