"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components";
import { getOccupationStatusLabel } from "@/lib/utils";
import { OccupationStatus } from "@prisma/client";
import { useState } from "react";

// Transform OccupationStatus into an array
const occupationStatusArray = Object.values(
	OccupationStatus
) as OccupationStatus[];

interface StatusSelectionProps {
	initialValue?: OccupationStatus;
}

export function StatusSelection({ initialValue }: StatusSelectionProps) {
	const [selectedStatus, setSelectedStatus] = useState<
		OccupationStatus | undefined
	>(initialValue);

	// Handle onChange event
	const handleChange = (value: OccupationStatus) => {
		setSelectedStatus(value);
		console.log("Selected value:", value);
	};

	return (
		<Select value={selectedStatus} onValueChange={handleChange}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Select a status">
					{selectedStatus
						? getOccupationStatusLabel(selectedStatus)
						: "Select a status"}
				</SelectValue>
			</SelectTrigger>

			<SelectContent>
				<SelectGroup>
					<SelectLabel>Occupation Status</SelectLabel>
					{occupationStatusArray.map((status) => (
						<SelectItem key={status} value={status}>
							{getOccupationStatusLabel(status)}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
