import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components";
import { getIndustryName } from "@/lib/utils";
import { Recruitment } from "@prisma/client";
import { format } from "date-fns";
import { Briefcase, CalendarIcon, Tag, Users } from "lucide-react";
import Link from "next/link";

export default function RecruitmentInfo({
	recruitment,
	batches,
}: {
	recruitment: Recruitment;
	batches: number[];
}) {
	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="text-2xl">{recruitment.title}</CardTitle>
						<CardDescription className="flex items-center mt-2">
							<CalendarIcon className="mr-2 h-4 w-4" />
							{format(new Date(recruitment.date), "PPP")}
						</CardDescription>
					</div>
					<Button asChild variant="outline" size="sm">
						<Link href={`/admin/recruitment/${recruitment.id}/edit`}>Edit</Link>
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
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
				</div>
			</CardContent>
		</Card>
	);
}
