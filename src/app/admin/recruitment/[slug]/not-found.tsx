import { NotFoundComponent } from "@/components";
import React from "react";

export default function NotFound() {
	return (
		<NotFoundComponent
			title="Recruitment info not found"
			description="The recruitment info you are looking for does not exist."
			backLabel="Back to recruitment list"
			backTo="/admin/recruitment"
		/>
	);
}
