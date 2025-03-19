import { readAlumniRecord } from "@/actions/alumni-account";
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Button,
	Input,
	Label,
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components";
import { Alumni, AlumniAccount } from "@prisma/client";
import { Check, Shield, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface VerifyAlumniSheetProps {
	closeSheet: VoidFunction;
	alumni: AlumniAccount;
}

export default function VerifyAlumniSheet({
	closeSheet,
	alumni,
}: VerifyAlumniSheetProps) {
	const [alumniRecord, setAlumniRecord] = useState<Alumni | null>(null);
	const [error, setError] = useState(false);

	const fetchAlumni = async () => {
		try {
			const record = await readAlumniRecord({ lrn: alumni.lrn });

			setAlumniRecord(record);
		} catch {
			setError(true);
		}
	};

	useEffect(() => {
		fetchAlumni();
	}, [alumni.id]);

	const canConnect = alumniRecord?.lrn === alumni.lrn && !alumni.alumniId;

	return (
		<Sheet open={!!alumni} onOpenChange={closeSheet}>
			<SheetContent className="w-full md:min-w-[500px]">
				<SheetHeader>
					<SheetTitle>Verify Account</SheetTitle>
					<SheetDescription>
						<SheetDescription>
							Please verify the details of the alumni account before proceeding.
							Ensure that the information is accurate and up-to-date.
						</SheetDescription>
					</SheetDescription>
				</SheetHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-6">
						<div className="bg-gray-100 p-4 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold">Alumni Information</h3>
							<p className="flex justify-between">
								<strong>LRN:</strong> <span>{alumni.lrn}</span>
							</p>
							<p className="flex justify-between">
								<strong>First Name:</strong> <span>{alumni.firstName}</span>
							</p>
							<p className="flex justify-between">
								<strong>Last Name:</strong> <span>{alumni.lastName}</span>
							</p>
							<p className="flex justify-between">
								<strong>Email:</strong> <span>{alumni.email}</span>
							</p>
							<p className="flex justify-between">
								<strong>Batch:</strong> <span>{alumni.graduationYear}</span>
							</p>
						</div>
						<div className="bg-gray-100 p-4 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold">System Record</h3>
							{alumniRecord ? (
								<>
									<p className="flex justify-between">
										<strong>LRN:</strong> <span>{alumniRecord.lrn}</span>
									</p>
									<p className="flex justify-between">
										<strong>First Name:</strong>{" "}
										<span>{alumniRecord.firstName}</span>
									</p>
									<p className="flex justify-between">
										<strong>Last Name:</strong>{" "}
										<span>{alumniRecord.lastName}</span>
									</p>
									<p className="flex justify-between">
										<strong>Batch:</strong>{" "}
										<span>{alumniRecord.graduationYear}</span>
									</p>
									{!alumniRecord.alumniId ? (
										<p className="text-green-600 font-medium">
											The alumni record is available for connection.
										</p>
									) : (
										<p className="text-red-600 font-medium">
											This alumni record is already connected to an account.
										</p>
									)}
								</>
							) : (
								<p className="text-gray-500">NO RECORD</p>
							)}
						</div>
					</div>
					{error && (
						<div className="text-red-600">
							<p>Failed to fetch alumni record. Please try again.</p>
							<Button onClick={fetchAlumni} variant="outline">
								Retry
							</Button>
						</div>
					)}
					{alumniRecord?.lrn === alumni.lrn ? (
						<div className="alert alert-success">
							This account can be verified and connected.
						</div>
					) : (
						<div></div>
					)}
					<Alert
						variant={canConnect && alumniRecord ? "primary" : "destructive"}>
						{canConnect ? (
							<Check className="text-white h-4 w-4" />
						) : (
							<X className="text-white h-4 w-4" />
						)}
						<AlertTitle>
							{canConnect ? "Connection Possible!" : "Connection Not Possible!"}
						</AlertTitle>
						<AlertDescription>
							{canConnect
								? "This alumni record can be linked to an account."
								: !alumniRecord
								? "No record exists for this pending account."
								: "This alumni record cannot be linked to an account."}
						</AlertDescription>
					</Alert>
				</div>
				<SheetFooter className="mt-5 block p-0">
					<p className="text-gray-500 px-5 mb-2 block">
						Note: Ensure that the alumni record is correctly linked to this
						account before saving changes.
					</p>
					{!canConnect && (
						<Button className="w-full " type="button">
							Save changes
						</Button>
					)}
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
