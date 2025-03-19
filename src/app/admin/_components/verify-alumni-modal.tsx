import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components";
import { AlumniAccount } from "@prisma/client";
import React, { useEffect, useState } from "react";

interface VerifyAlumniModalProps {
	closeModal: VoidFunction;
	alumni: AlumniAccount;
}

export default function VerifyAlumniModal({
	closeModal,
	alumni,
}: VerifyAlumniModalProps) {
	const [alumniAccounts, setAlumniAccounts] = useState<AlumniAccount[]>([]);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchAlumni = async () => {
			try {
			} catch {
				setError(true);
			}
		};

		fetchAlumni();
	}, [alumni.id]);

	return (
		<Dialog open={!!alumni.id} onOpenChange={closeModal}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Verify Alumni Account</DialogTitle>
					<DialogDescription>
						Please verify the account of {alumni.firstName} {alumni.lastName}{" "}
						with LRN .
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4"></div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={closeModal}>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
