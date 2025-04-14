"use client";

import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { QRCodeScanner } from "./qr-code-scanner";

interface EventInfoHeaderProps {
	eventTitle: string;
	eventSlug: string;
	eventId: number;
	status: string;
}

export default function EventInfoHeader({
	eventTitle,
	eventId,
	eventSlug,
	status,
}: EventInfoHeaderProps) {
	const { user } = useAuth();

	return (
		<div className="flex justify-between items-center">
			<h1 className="text-3xl font-medium">{eventTitle}</h1>

			{user && user.role !== "ALUMNI" && (
				<div className="flex items-center gap-2">
					{status === "Upcoming Event" && (
						<Link href={`/admin/events/${eventSlug}/edit`}>
							<Button>Edit</Button>
						</Link>
					)}
					{status === "Ongoing Event" && <QRCodeScanner eventId={eventId} />}
				</div>
			)}
		</div>
	);
}
