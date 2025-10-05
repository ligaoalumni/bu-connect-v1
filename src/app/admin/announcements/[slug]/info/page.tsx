import { readAnnouncementAction } from "@/actions";
import dynamic from "next/dynamic";
import { LoaderComponent } from "@/components";

const AnnouncementForm = dynamic(
  () => import("../../__components/announcement-form"),
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

  return <AnnouncementForm readOnly announcement={announcement} />;
}
