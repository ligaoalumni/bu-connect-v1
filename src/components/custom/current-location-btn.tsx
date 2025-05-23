"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";

interface CurrentLocationButtonProps {
	onLocationFound: (lat: number, lng: number) => void;
}

export default function CurrentLocationButton({
	onLocationFound,
}: CurrentLocationButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleGetCurrentLocation = () => {
		setIsLoading(true);

		if (!navigator.geolocation) {
			toast.error("error", {
				description: "Geolocation is not supported by your browser",
				richColors: true,
				position: "top-center",
			});
			setIsLoading(false);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				onLocationFound(latitude, longitude);
				setIsLoading(false);
			},
			(error) => {
				let errorMessage = "Failed to get your location";

				switch (error.code) {
					case error.PERMISSION_DENIED:
						errorMessage =
							"Location permission denied. Please enable location services.";
						break;
					case error.POSITION_UNAVAILABLE:
						errorMessage = "Location information is unavailable";
						break;
					case error.TIMEOUT:
						errorMessage = "Location request timed out";
						break;
				}

				toast.error("Error", {
					description: errorMessage,
					richColors: true,
					position: "top-center",
				});
				setIsLoading(false);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			}
		);
	};

	return (
		<Button
			onClick={handleGetCurrentLocation}
			disabled={isLoading}
			variant="outline"
			size="sm"
			className="flex items-center gap-2">
			{isLoading ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<MapPin className="h-4 w-4" />
			)}
			{isLoading ? "Getting location..." : "Use my location"}
		</Button>
	);
}
