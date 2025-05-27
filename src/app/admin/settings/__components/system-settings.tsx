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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/components";
import { AlertTriangle, Save } from "lucide-react";

export default function SystemSettings() {
	const [maintenanceMode, setMaintenanceMode] = useState(false);
	const [registrationOpen, setRegistrationOpen] = useState(true);
	const [defaultUserRole, setDefaultUserRole] = useState("ALUMNI");
	const [requireVerification, setRequireVerification] = useState(true);
	const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
	const [sessionTimeout, setSessionTimeout] = useState(60);

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
							defaultValue="A platform for alumni to connect, track events, and stay updated with announcements."
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
								checked={maintenanceMode}
								onCheckedChange={setMaintenanceMode}
							/>
						</div>
					</div>

					{maintenanceMode && (
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
					<Button>
						<Save className="mr-2 h-4 w-4" />
						Save Changes
					</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Registration & User Settings</CardTitle>
					<CardDescription>
						Configure user registration and account settings.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<div>
								<Label htmlFor="registration-open" className="text-base">
									Allow New Registrations
								</Label>
								<p className="text-sm text-muted-foreground">
									When disabled, new users cannot register on the platform.
								</p>
							</div>
							<Switch
								id="registration-open"
								checked={registrationOpen}
								onCheckedChange={setRegistrationOpen}
							/>
						</div>
					</div>

					<Separator />

					<div className="space-y-2">
						<Label htmlFor="default-role" className="text-base">
							Default User Role
						</Label>
						<Select value={defaultUserRole} onValueChange={setDefaultUserRole}>
							<SelectTrigger id="default-role">
								<SelectValue placeholder="Select default role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ALUMNI">Alumni</SelectItem>
								<SelectItem value="ADMIN">Admin</SelectItem>
							</SelectContent>
						</Select>
						<p className="text-sm text-muted-foreground">
							The default role assigned to new users upon registration.
						</p>
					</div>

					<Separator />

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<div>
								<Label htmlFor="require-verification" className="text-base">
									Require Email Verification
								</Label>
								<p className="text-sm text-muted-foreground">
									When enabled, new users must verify their email before
									accessing the platform.
								</p>
							</div>
							<Switch
								id="require-verification"
								checked={requireVerification}
								onCheckedChange={setRequireVerification}
							/>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button>
						<Save className="mr-2 h-4 w-4" />
						Save Changes
					</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Security Settings</CardTitle>
					<CardDescription>
						Configure security-related settings for the platform.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="max-login-attempts" className="text-base">
							Maximum Login Attempts
						</Label>
						<Input
							id="max-login-attempts"
							type="number"
							min="1"
							max="10"
							value={maxLoginAttempts}
							onChange={(e) =>
								setMaxLoginAttempts(Number.parseInt(e.target.value))
							}
						/>
						<p className="text-sm text-muted-foreground">
							Number of failed login attempts before account is temporarily
							locked.
						</p>
					</div>

					<Separator />

					<div className="space-y-2">
						<Label htmlFor="session-timeout" className="text-base">
							Session Timeout (minutes)
						</Label>
						<Input
							id="session-timeout"
							type="number"
							min="15"
							max="1440"
							value={sessionTimeout}
							onChange={(e) =>
								setSessionTimeout(Number.parseInt(e.target.value))
							}
						/>
						<p className="text-sm text-muted-foreground">
							Time in minutes before an inactive user is automatically logged
							out.
						</p>
					</div>
				</CardContent>
				<CardFooter>
					<Button>
						<Save className="mr-2 h-4 w-4" />
						Save Changes
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
