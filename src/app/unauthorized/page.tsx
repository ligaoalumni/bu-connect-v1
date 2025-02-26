import React from "react";
import { Shield } from "lucide-react";
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	Button,
} from "@/components";
import Link from "next/link";

const UnauthorizedAccess = () => {
	// Function to handle redirect to login

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<Card className="max-w-md w-full">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Shield className="h-6 w-6 text-red-500" />
						<CardTitle>Access Denied</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<Alert variant="destructive">
						<AlertTitle>Unauthorized Access</AlertTitle>
						<AlertDescription>
							You don&apos;t have permission to access this resource.
						</AlertDescription>
					</Alert>

					<p className="text-gray-600">
						Please verify your credentials and ensure you have the necessary
						permissions. If you believe this is an error, contact your
						administrator.
					</p>
				</CardContent>
				<CardFooter className="flex gap-2 justify-end">
					<Button asChild>
						<Link href="/">Go back to Home</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default UnauthorizedAccess;
