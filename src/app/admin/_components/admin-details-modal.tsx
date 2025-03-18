"use client";

import type React from "react";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Mail, ShieldCheck, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UserTableData } from "@/types";

interface AdminDetailsModalProps {
	user: UserTableData;
	closeModal: () => void;
}

export default function AdminDetailsModal({
	user,
	closeModal,
}: AdminDetailsModalProps) {
	// Get user initials for avatar fallback
	const getInitials = () => {
		const first = user.firstName.charAt(0);
		const last = user.lastName.charAt(0);
		return `${first}${last}`;
	};

	// Format date or show placeholder
	const formatDate = (date: Date | null) => {
		if (!date) return "Not set";
		return format(date, "PPP");
	};

	// Get status badge color
	const getStatusColor = () => {
		switch (user.status) {
			case "ACTIVE":
				return "bg-green-500";
			case "BLOCKED":
				return "bg-red-500";
			case "PENDING":
				return "bg-yellow-500";
			case "DELETED":
				return "bg-gray-500";
			default:
				return "bg-gray-500";
		}
	};

	return (
		<Dialog open={user !== null} onOpenChange={closeModal}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>User Details</DialogTitle>
					<DialogDescription>
						Comprehensive information about this user.
					</DialogDescription>
				</DialogHeader>

				<div className="flex items-center space-x-4 py-4">
					<Avatar className="h-16 w-16">
						<AvatarImage
							src={user.avatar || undefined}
							alt={`${user.firstName} ${user.lastName}`}
						/>
						<AvatarFallback className="text-lg uppercase">
							{getInitials()}
						</AvatarFallback>
					</Avatar>
					<div>
						<h3 className="text-lg font-medium">
							{user.firstName} {user.middleName ? `${user.middleName} ` : ""}
							{user.lastName}
						</h3>
						<div className="flex items-center text-sm text-muted-foreground">
							<Mail className="mr-1 h-4 w-4" />
							{user.email}
						</div>
						<div className="mt-1 flex items-center">
							<Badge
								variant="outline"
								className={`${getStatusColor()} text-white`}>
								{user.status}
							</Badge>
						</div>
					</div>
				</div>

				<Separator />

				<div className="grid gap-4 py-4">
					<div>
						<h4 className="mb-2 font-medium">Account Information</h4>
						<dl className="grid grid-cols-[100px_1fr] gap-2 text-sm">
							<dt className="text-muted-foreground">ID:</dt>
							<dd>{user.id}</dd>

							<dt className="text-muted-foreground">Role:</dt>
							<dd className="flex items-center">
								<ShieldCheck className="mr-1 h-4 w-4 text-blue-500" />
								{user.role}
							</dd>

							<dt className="text-muted-foreground">Verified:</dt>
							<dd>{user.verifiedAt ? "Yes" : "No"}</dd>
						</dl>
					</div>

					<div>
						<h4 className="mb-2 font-medium">Timestamps</h4>
						<dl className="grid grid-cols-[100px_1fr] gap-2 text-sm">
							<dt className="text-muted-foreground">Created:</dt>
							<dd className="flex items-center">
								<CalendarIcon className="mr-1 h-4 w-4 text-green-500" />
								{formatDate(user.createdAt)}
							</dd>

							<dt className="text-muted-foreground">Updated:</dt>
							<dd className="flex items-center">
								<Clock className="mr-1 h-4 w-4 text-amber-500" />
								{formatDate(user.updatedAt)}
							</dd>

							<dt className="text-muted-foreground">Verified:</dt>
							<dd>{formatDate(user.verifiedAt)}</dd>
						</dl>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
