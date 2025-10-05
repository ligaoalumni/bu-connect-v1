import { LoaderComponent } from "@/components";
import dynamic from "next/dynamic";

const AnnouncementForm = dynamic(
  () => import("@/app/admin/announcements/__components/announcement-form"),
  {
    loading: LoaderComponent,
  },
);

export default function AddAnnouncement() {
  return (
    <div className="mt-10 px-5 md:px-10">
      <AnnouncementForm />;
    </div>
  );
}
