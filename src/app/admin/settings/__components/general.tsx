"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Button,
	Input,
	Label,
	Switch,
	Textarea,
	Separator,
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/components";
import { AlertTriangle, Loader2, Save } from "lucide-react";
import { Setting } from "@prisma/client";
import { toast } from "sonner";
import { updateSettingsAction } from "@/actions";

interface GeneralSettingsProps {
	data: Pick<Setting, "isMaintenance" | "description" | "websiteName">;
}

export default function GeneralSettings({ data }: GeneralSettingsProps) {
	const [info, setInfo] = useState(data);
	const [loading, setLoading] = useState(false);

	const handleUpdateSettings = async () => {
		try {
			setLoading(true);

			await updateSettingsAction({
				websiteName: info.websiteName,
				description: info.description || "",
				isMaintenance: info.isMaintenance,
			});

			toast.success("Settings updated successfully!", {
				description: "Your changes have been saved.",
				duration: 5000,
				position: "top-center",
				richColors: true,
			});
		} catch {
			toast.error("Failed to update settings. Please try again.", {
				description: "An error occurred while updating the settings.",
				duration: 5000,
				position: "top-center",
				richColors: true,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>General Settings</CardTitle>
					<CardDescription>
						Configure general system settings and behavior.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="site-name" className="text-base">
								Site Name
							</Label>
						</div>
						<Input
							id="site-name"
							defaultValue="Alumni QR Code Tracking System"
							onChange={(e) =>
								setInfo({ ...info, websiteName: e.target.value })
							}
							readOnly={loading}
						/>
						<p className="text-sm text-muted-foreground">
							This name will be displayed in the header and emails.
						</p>
					</div>

					<Separator />

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="site-description" className="text-base">
								Site Description
							</Label>
						</div>
						<Textarea
							id="site-description"
							value={info.description || ""}
							onChange={(e) =>
								setInfo({ ...info, description: e.target.value })
							}
							readOnly={loading}
						/>
						<p className="text-sm text-muted-foreground">
							This description will be used for SEO and meta tags.
						</p>
					</div>

					<Separator />

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<div>
								<Label htmlFor="maintenance-mode" className="text-base">
									Maintenance Mode
								</Label>
								<p className="text-sm text-muted-foreground">
									When enabled, only administrators can access the site.
								</p>
							</div>
							<Switch
								id="maintenance-mode"
								checked={info.isMaintenance}
								name="isMaintenance"
								disabled={loading}
								onCheckedChange={(v) => setInfo({ ...info, isMaintenance: v })}
							/>
						</div>
					</div>

					{info.isMaintenance && (
						<Alert variant="destructive">
							<AlertTriangle className="h-4 w-4" />
							<AlertTitle>Warning</AlertTitle>
							<AlertDescription>
								Maintenance mode is currently enabled. Only administrators can
								access the site.
							</AlertDescription>
						</Alert>
					)}
				</CardContent>
				<CardFooter>
					<Button disabled={loading} onClick={handleUpdateSettings}>
						{loading ? (
							<>
								<Loader2 className="animate-spin " />
								Saving...
							</>
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								Save Changes
							</>
						)}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
