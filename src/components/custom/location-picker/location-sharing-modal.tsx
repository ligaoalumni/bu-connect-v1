"use client";

import { useState } from "react";
import { MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LocationSharingModalProps {
	shareLocation: boolean;
}

export function LocationSharingModal({
	shareLocation,
}: LocationSharingModalProps) {
	const [open, setOpen] = useState(false);
	const [isShareLocation, setIsShareLocation] = useState(shareLocation);

	// Save preference when changed
	const handleToggleChange = (checked: boolean) => {
		setIsShareLocation(checked);
		localStorage.setItem("shareLocation", checked.toString());
	};

	return (
		<>
			<Button
				onClick={() => setOpen(true)}
				className="flex items-center gap-2 relative z-50">
				<MapPin className="h-4 w-4" />
				Location Settings
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Location Sharing Preferences</DialogTitle>
						<DialogDescription>
							Control whether your location is visible on public maps.
						</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-4 py-4">
						<div className="flex items-center justify-between space-x-2">
							<div className="space-y-0.5">
								<Label htmlFor="share-location">
									Share my location publicly
								</Label>
								<p className="text-sm text-muted-foreground">
									When enabled, your current location will be visible on public
									maps
								</p>
							</div>
							<Switch
								id="share-location"
								checked={isShareLocation}
								onCheckedChange={handleToggleChange}
							/>
						</div>

						<div className="flex items-start gap-2 text-sm">
							<Shield className="h-4 w-4 mt-0.5 text-muted-foreground" />
							<p className="text-muted-foreground">
								Your privacy is important. You can change this setting at any
								time.
								{isShareLocation &&
									" Remember that sharing your location publicly may have privacy implications."}
							</p>
						</div>
					</div>

					<DialogFooter className="flex sm:justify-between">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button onClick={() => setOpen(false)}>Save Preferences</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
