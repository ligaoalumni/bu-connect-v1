import { verifyAlumniAccount } from "@/actions";
import { readAlumniRecord } from "@/actions/alumni-account";
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Button,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	Skeleton,
} from "@/components";
import { AlumniWithRelation } from "@/types";
import { AlumniAccount } from "@prisma/client";
import { formatDate } from "date-fns";
import { Check, Loader2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface VerifyAlumniSheetProps {
	closeSheet: VoidFunction;
	alumni: AlumniAccount;
	handleComplete: VoidFunction;
}

export default function VerifyAlumniSheet({
	closeSheet,
	alumni,
	handleComplete,
}: VerifyAlumniSheetProps) {
	const [alumniRecord, setAlumniRecord] = useState<AlumniWithRelation | null>(
		null
	);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [connecting, setConnecting] = useState(false);

	const fetchAlumni = async () => {
		try {
			setLoading(true);
			const record = await readAlumniRecord({ lrn: alumni.lrn });
			setAlumniRecord(record);
		} catch {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAlumni();
	}, [alumni.id]);

	const handleVerifyAccount = async () => {
		if (!alumniRecord?.id) return;
		setConnecting(true);
		try {
			await verifyAlumniAccount(alumni.id, alumniRecord.id);

			toast.success("Account verified!", {
				description: "The alumni account has been successfully verified.",
				richColors: true,
				position: "top-center",
			});
			closeSheet();
			handleComplete();
		} catch (err) {
			toast.error("An error occurred!", {
				description:
					err instanceof Error
						? err.message
						: "Something went wrong, please contact support!",
				richColors: true,
				position: "top-center",
			});
		} finally {
			setConnecting(false);
		}
	};

	const canConnect =
		!alumniRecord?.alumniId && alumniRecord?.lrn === alumni.lrn;

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
							<h3 className="text-lg font-semibold">Account Information</h3>
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
							<h3 className="text-lg font-semibold">
								{loading ? (
									<Skeleton className="w-1/4 h-9" />
								) : (
									"Alumni System Record"
								)}
							</h3>
							{loading ? (
								<div className="space-y-2 mt-2">
									<p className="flex justify-between">
										<strong className="w-20">
											<Skeleton className="w-full h-4" />
										</strong>
										<span className="w-32">
											<Skeleton className="w-full h-4" />
										</span>
									</p>
									<p className="flex justify-between">
										<strong className="w-20">
											<Skeleton className="w-full h-4" />
										</strong>
										<span className="w-32">
											<Skeleton className="w-full h-4" />
										</span>
									</p>
									<p className="flex justify-between">
										<strong className="w-20">
											<Skeleton className="w-full h-4" />
										</strong>
										<span className="w-32">
											<Skeleton className="w-full h-4" />
										</span>
									</p>
									<p className="flex justify-between">
										<strong className="w-20">
											<Skeleton className="w-full h-4" />
										</strong>
										<span className="w-32">
											<Skeleton className="w-full h-4" />
										</span>
									</p>
								</div>
							) : alumniRecord ? (
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
									{alumniRecord.alumniAccount && (
										<>
											<Separator className="my-2" />
											<p>Account Connected:</p>
											<div className="px-2">
												<p className="flex justify-between">
													<strong>Email:</strong>{" "}
													<span>{alumniRecord.alumniAccount.email}</span>
												</p>
												<p className="flex justify-between">
													<strong>Account ID:</strong>{" "}
													<span>{alumniRecord.alumniAccount.id}</span>
												</p>
												<p className="flex justify-between">
													<strong>Date joined:</strong>{" "}
													<span>
														{formatDate(
															alumniRecord.alumniAccount.createdAt,
															"MMM dd, yyyy"
														)}
													</span>
												</p>
											</div>
										</>
									)}
								</>
							) : (
								<Alert variant="destructive" className="mt-2">
									<AlertTitle>No Record Found</AlertTitle>
									<AlertDescription>
										We couldn&apos;t find any record in the system for the
										provided details.
									</AlertDescription>
								</Alert>
							)}
						</div>
					</div>
					{/* {error && (
						<div className="  justify-center flex flex-col items-center">
							{loading ? (
								<>
									<Loader2 className="animate-spin" />
									<p>Fetching records...</p>
								</>
							) : (
								<>
									<p>Failed to fetch alumni record.</p>
									<p>Please try again.</p>
								</>
							)}
							<Button
								disabled={loading}
								onClick={fetchAlumni}
								variant="outline">
								Retry
							</Button>
						</div>
					)} */}

					{!loading && (
						<Alert
							variant={canConnect && alumniRecord ? "primary" : "destructive"}>
							{canConnect ? (
								<Check className="text-white h-4 w-4" />
							) : (
								<X className="text-white h-4 w-4" />
							)}
							<AlertTitle>
								{canConnect
									? "Connection Possible!"
									: "Connection Not Possible!"}
							</AlertTitle>
							<AlertDescription>
								{canConnect
									? "This alumni record can be linked to an account."
									: !alumniRecord
									? "No record found for the specified account."
									: alumniRecord?.alumniId
									? "This alumni already has an associated account."
									: "This alumni record cannot be linked to an account."}
							</AlertDescription>
						</Alert>
					)}
				</div>
				<SheetFooter className="mt-5 block p-0">
					{!loading && canConnect && (
						<>
							<p className="text-gray-500 px-5 mb-2 block">
								Note: Ensure that the alumni record is correctly linked to this
								account before saving changes.
							</p>
							<Button
								disabled={connecting || loading}
								className="w-full "
								type="button"
								onClick={handleVerifyAccount}>
								{connecting ? (
									<>
										<Loader2 className="animate-spin" />
										Connecting...
									</>
								) : (
									"Connect Account"
								)}
							</Button>
						</>
					)}
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
