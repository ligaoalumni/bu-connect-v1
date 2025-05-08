import { NotFoundComponent } from "@/components";
import React from "react";

export default function NotFound() {
	return (
		<NotFoundComponent
			backLabel="Back to Batches"
			backTo="/batch"
			title="404 | Batch Not Found"
			description="The batch you are looking for does not exist or has been removed."
		/>
	);
}
