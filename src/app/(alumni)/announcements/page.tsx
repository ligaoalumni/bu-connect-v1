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

	return <AnnouncementsInfiniteScroll defaultData={announcements.data} />;
}
