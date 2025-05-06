import { NotFoundComponent } from "@/components";
import React from "react";

export default function NotFound() {
	return (
		<NotFoundComponent
			backLabel="Back to posts feed"
			backTo="/posts"
			title="404 | Post not found"
			description="The post you are looking for does not exist or has been removed."
		/>
	);
}
