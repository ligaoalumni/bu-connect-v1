import { readAnnouncementAction } from "@/actions";

import { LoaderComponent } from "@/components";
import dynamic from "next/dynamic";

const AnnouncementForm = dynamic(
  () => import("@/app/admin/announcements/__components/announcement-form"),
  {
    loading: LoaderComponent,
  },
);

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const announcement = await readAnnouncementAction(slug);
  if (!announcement) {
    return <div>Announcement not found</div>;
  }

  return (
    <div className="py-10 px-5 md:px-10">
      <AnnouncementForm edit announcement={announcement} />
    </div>
  );
}
