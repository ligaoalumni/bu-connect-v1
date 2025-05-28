"use client";

import { updateUserAction } from "@/actions";
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
import { toast } from "sonner";

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
	const [loading, setLoading] = useState(false);

	// Handle onChange event
	const handleChange = async (value: OccupationStatus) => {
		const prevValue = selectedStatus;

		try {
			setLoading(true);
			setSelectedStatus(value);

			await updateUserAction({
				occupationStatus: value,
			});
			toast.success("Occupation status updated successfully!", {
				duration: 5000,
				position: "top-center",
				richColors: true,
				description: `Your occupation status is now set to ${getOccupationStatusLabel(
					value
				)}.`,
			});
		} catch (error) {
			toast.error("Failed to update occupation status.", {
				duration: 5000,
				position: "top-center",
				richColors: true,
				description: "Please try again later.",
			});
			console.log(error);
			setSelectedStatus(prevValue);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Select
			disabled={loading}
			value={selectedStatus}
			onValueChange={handleChange}>
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
