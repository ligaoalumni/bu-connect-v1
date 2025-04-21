import { readAnnouncementAction } from "@/actions";
import AnnouncementForm from "../../__components/announcement-form";

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
