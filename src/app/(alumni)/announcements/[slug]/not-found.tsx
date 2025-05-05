import { NotFoundComponent } from "@/components";
import React from "react";

export default function NotFound() {
	return (
		<NotFoundComponent
			backLabel="Back to announcements feed"
			backTo="/announcements"
			title="Announcement not found"
			description="The announcement you are looking for does not exist or has been removed."
		/>
	);
}
