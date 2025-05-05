import { NotFoundComponent } from "@/components";
import React from "react";

export default function NotFound() {
	return (
		<NotFoundComponent
			title="404 - Poll Not Found"
			backLabel="Back to polls list"
			backTo="/admin/polls"
		/>
	);
}
