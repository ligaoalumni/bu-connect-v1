"use client";

import { useState } from "react";
import { Button } from "@/components";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { MapModal } from "./map-modal";
import { AddressData } from "@/types";

interface LocationPickerProps {
	value: AddressData | undefined;
	onChange: (value: AddressData) => void;
	disabled?: boolean;
}

export function LocationPicker({
	value,
	onChange,
	disabled = false,
}: LocationPickerProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleSaveLocation = (address: AddressData) => {
		onChange(address);
	};

	return (
		<div className="space-y-2">
			<div className="flex items-end gap-2">
				<div className="flex-1">
					<Input
						value={value?.address || ""}
						readOnly
						placeholder="No location selected"
						className="  dark:text-white dark:selection:bg-black/15 placeholder:text-white/60 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
					/>
				</div>
				<Button
					type="button"
					size="sm"
					onClick={() => setIsModalOpen(true)}
					disabled={disabled}
					className="flex items-center gap-1  hover:bg-white/80 hover:text-black/80">
					<MapPin className="h-4 w-4" />
					{value ? "Change" : "Select"} Location
				</Button>
			</div>

			{value && (
				<p className="text-xs text-white/80">
					Coordinates: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
				</p>
			)}

			<MapModal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				onSave={handleSaveLocation}
				initialAddress={value}
			/>
		</div>
	);
}
