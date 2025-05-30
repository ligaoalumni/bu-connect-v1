"use client";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Separator,
} from "@/components";
import { getIndustryName } from "@/lib";
import { format, formatDistanceToNow } from "date-fns";
import {
	Briefcase,
	CalendarIcon,
	Tag,
	UserRoundSearch,
	Users,
} from "lucide-react";
import Link from "next/link";
import ApplyDialog from "./apply";
import { useAuth } from "@/contexts";
import { RecruitmentWithApplicants } from "@/types";

export default function RecruitmentInfo({
	recruitment,
	batches,
	isAdmin = false,
}: {
	recruitment: RecruitmentWithApplicants;
	batches: number[];
	isAdmin?: boolean;
}) {
	const { user } = useAuth();

	const applicantsIds = recruitment.applicants.map((applicant) => applicant.id);

	return (
		<Card className="w-full">
			<CardHeader>
				{!isAdmin && (
					<h3 className="text-gray-500 h-7  flex items-center gap-2">
						<span>Posted by admin</span>
						<Separator orientation="vertical" className="w-0.5" />
						<span>
							{formatDistanceToNow(recruitment.createdAt, {
								addSuffix: true,
							})}
						</span>
					</h3>
				)}
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="text-2xl">{recruitment.eventTitle}</CardTitle>
						<CardDescription className="flex items-center mt-2">
							<CalendarIcon className="mr-2 h-4 w-4" />
							{format(new Date(recruitment.date), "PPP")}
						</CardDescription>
					</div>
					{isAdmin && (
						<Button asChild variant="outline" size="sm">
							<Link href={`/admin/recruitment/${recruitment.id}/edit`}>
								Edit
							</Link>
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				<div>
					<h3 className="text-sm font-medium flex items-center mb-2">
						<UserRoundSearch className="mr-2 h-4 w-4" /> Recruiting
					</h3>
					<Badge variant="outline" className="text-sm">
						{recruitment.recruiting}
					</Badge>
				</div>
				<div>
					<h3 className="text-sm font-medium flex items-center mb-2">
						<Briefcase className="mr-2 h-4 w-4" /> Industry
					</h3>
					<Badge variant="outline" className="text-sm">
						{getIndustryName(recruitment.industry)}
					</Badge>
				</div>

				<div>
					<h3 className="text-sm font-medium flex items-center mb-2">
						<Users className="mr-2 h-4 w-4" /> Allowed Batches
					</h3>
					<div className="flex flex-wrap gap-2">
						{recruitment.allowedBatches.length === batches.length ? (
							<Badge variant="secondary">All batches</Badge>
						) : (
							recruitment.allowedBatches.map((batchId) => (
								<Badge key={batchId} variant="secondary">
									Batch {batchId}
								</Badge>
							))
						)}
					</div>
				</div>

				<div>
					<h3 className="text-sm font-medium flex items-center mb-2">
						<Tag className="mr-2 h-4 w-4" /> Topics
					</h3>
					<div className="flex flex-wrap gap-2">
						{recruitment.topics.split(",").map((topic, index) => (
							<Badge key={index} variant="outline">
								{topic}
							</Badge>
						))}
					</div>
					<div>
						{recruitment.applicants.length > 0 ? (
							<span className="text-sm text-gray-500">
								{recruitment.applicants.length} applicants
							</span>
						) : (
							<span className="text-sm text-gray-500">No applicants yet</span>
						)}
					</div>
				</div>
			</CardContent>
			{!isAdmin && (
				<CardFooter>
					<ApplyDialog
						alreadyApplied={applicantsIds.includes(Number(user?.id))}
						eventTitle={recruitment.eventTitle}
						recruitment={recruitment.recruiting}
						recruitmentId={recruitment.id}
					/>
				</CardFooter>
			)}
		</Card>
	);
}
