import { readAlumniAction } from "@/actions";
import {
	Button,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	Skeleton,
} from "@/components";
import { User } from "@prisma/client";
import { formatDate } from "date-fns";
import React, { useEffect, useState } from "react";

interface AlumniDetailsSheetProps {
	closeSheet: VoidFunction;
	id: number;
}

export default function AlumniDetailsSheet({
	closeSheet,
	id,
}: AlumniDetailsSheetProps) {
	const [alumni, setAlumni] = useState<User | null>(null);
	const [, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	const fetchAlumni = async () => {
		try {
			setLoading(true);
			setAlumni(await readAlumniAction(id));
		} catch {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAlumni();
	}, [id]);

	return (
		<Sheet open={!!id} onOpenChange={closeSheet}>
			<SheetContent className="w-full md:min-w-[500px]">
				<SheetHeader>
					<SheetTitle>Alumni Details</SheetTitle>
					<SheetDescription>
						<SheetDescription>
							{/* // TODO: Refactor Description */}
							Please verify the details of the alumni account before proceeding.
							Ensure that the information is accurate and up-to-date.
						</SheetDescription>
					</SheetDescription>
				</SheetHeader>
				<div className="grid gap-4 py-4">
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
					) : alumni ? (
						<>
							<div className="space-y-6">
								<div className="bg-gray-100 p-4 rounded-lg shadow-md">
									<h3 className="text-lg font-semibold">
										Personal Information
									</h3>
									<p className="flex justify-between">
										<strong>First Name:</strong> <span>{alumni.firstName}</span>
									</p>
									<p className="flex justify-between">
										<strong>Middle Name:</strong>{" "}
										<span>{alumni.middleName}</span>
									</p>
									<p className="flex justify-between">
										<strong>Last Name:</strong> <span>{alumni.lastName}</span>
									</p>
									<p className="flex justify-between">
										<strong>Birth Date:</strong>{" "}
										<span>{formatDate(alumni.birthDate, "MMM dd, yyyy")}</span>
									</p>
									<p className="flex justify-between">
										<strong>Gender:</strong>{" "}
										<span className="first-letter:uppercase">
											{alumni.gender.replaceAll(/_/g, " ").toLowerCase()}
										</span>
									</p>
									<p className="flex justify-between">
										<strong>Contact Number:</strong>{" "}
										<span>{alumni.contactNumber}</span>
									</p>
									<p className="flex justify-between">
										<strong>Nationality:</strong>{" "}
										<span>{alumni.nationality}</span>
									</p>
									<p className="flex justify-between">
										<strong>Religion:</strong> <span>{alumni.religion}</span>
									</p>
									{/* // TODO: TO FIX */}
									<p className="flex justify-between">
										<strong>Address:</strong> <span>{alumni.religion}</span>
									</p>
								</div>

								<div className="bg-gray-100 p-4 rounded-lg shadow-md">
									<h3 className="text-lg font-semibold">
										Academic Information
									</h3>
									<p className="flex justify-between">
										<strong>Student ID:</strong> <span>{alumni.studentId}</span>
									</p>
									<p className="flex justify-between">
										<strong>email:</strong> <span>{alumni.email}</span>
									</p>
									<p className="flex justify-between">
										<strong>Course:</strong> <span>{alumni.course}</span>
									</p>
									<p className="flex justify-between">
										<strong>Batch:</strong> <span>{alumni.batch}</span>
									</p>
									<p className="flex justify-between">
										<strong>Ba:</strong> <span>{alumni.email}</span>
									</p>
								</div>

								<div className="bg-gray-100 p-4 rounded-lg shadow-md">
									<h3 className="text-lg font-semibold">Job Information</h3>
									<p className="flex justify-between">
										<strong>Current Occupation:</strong>{" "}
										<span
											className={`${
												!alumni.currentOccupation && "italic text-gray-600"
											}`}>
											{alumni.currentOccupation || "No Data"}
										</span>
									</p>

									<p className="flex justify-between">
										<strong>Company:</strong>{" "}
										<span
											className={`${
												!alumni.company && "italic text-gray-600"
											}`}>
											{alumni.company || "No Data"}
										</span>
									</p>

									<p className="flex justify-between">
										<strong>Job Title:</strong>{" "}
										<span
											className={`${
												!alumni.jobTitle && "italic text-gray-600"
											}`}>
											{alumni.jobTitle || "No Data"}
										</span>
									</p>
								</div>
							</div>
						</>
					) : (
						""
					)}
				</div>
				<SheetFooter className="mt-5 block p-0">
					<Button className="w-full " type="button" onClick={closeSheet}>
						Close
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
