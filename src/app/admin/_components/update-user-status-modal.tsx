"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Label,
	Badge,
	Button,
} from "@/components";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { userStatusColorMap } from "@/constant";
import { updateUserStatusAction } from "@/actions";
import { User } from "@prisma/client";

interface UpdateStatusModalProps {
	user: {
		id: number;
		firstName: string;
		lastName: string;
		status: User["status"];
	};
	closeModal: () => void;
	handleUpdateStatus: (id: number, status: User["status"]) => void;
}

export default function UpdateStatusModal({
	user,
	closeModal,
	handleUpdateStatus,
}: UpdateStatusModalProps) {
	const [status, setStatus] = useState<User["status"]>(user.status);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Handle status update
	const handleSubmit = async () => {
		if (status === user.status) {
			closeModal();
			return;
		}

		setIsSubmitting(true);
		try {
			//
			await updateUserStatusAction(user.id, status);
			handleUpdateStatus(user.id, status);

			closeModal();
			toast("Status updated", {
				description: `User status has been updated to ${status}`,
				richColors: true,
				position: "top-center",
			});
		} catch (error) {
			console.error(error);
			toast("Error", {
				description: "Failed to update user status",
				richColors: true,
				position: "top-center",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={!!user.id} onOpenChange={closeModal}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update User Status</DialogTitle>
					<DialogDescription>
						Change the status for user {user.firstName} {user.lastName}
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="status" className="text-right">
							Current Status
						</Label>
						<Badge variant={userStatusColorMap[user.status]}>
							{user.status}
						</Badge>
					</div>

					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="new-status" className="text-right">
							New Status
						</Label>
						<Select
							value={status}
							onValueChange={(value) => setStatus(value as User["status"])}>
							<SelectTrigger className="col-span-3" id="new-status">
								<SelectValue placeholder="Select new status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ACTIVE">ACTIVE</SelectItem>
								<SelectItem value="BLOCKED">BLOCKED</SelectItem>
								<SelectItem value="PENDING">PENDING</SelectItem>
								<SelectItem value="DELETED">DELETED</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{status === "BLOCKED" || status === "DELETED" ? (
						<div className="flex items-center gap-2 rounded-md bg-amber-50 p-3 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
							<AlertTriangle className="h-5 w-5 text-amber-500" />
							<p className="text-sm">
								{status === "BLOCKED"
									? "Blocking a user will prevent them from accessing the system."
									: "Deleting a user is a significant action and may have implications."}
							</p>
						</div>
					) : null}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={closeModal}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isSubmitting || status === user.status}>
						{isSubmitting ? "Updating..." : "Update Status"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
