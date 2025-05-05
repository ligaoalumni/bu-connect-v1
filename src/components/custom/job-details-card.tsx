import {
	Badge,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	RichTextEditor,
} from "@/components";
import { Building, Clock, MapPin } from "lucide-react";
import { Job } from "@prisma/client";

export function JobDetailsCard(job: Job) {
	// Format job type for display
	const formatJobType = (type: string) => {
		return type === "FULL_TIME"
			? "Full Time"
			: type.replace("_", "-").toLowerCase();
	};

	return (
		<Card className="max-w-screen-lg mx-auto shadow-lg rounded-lg">
			<CardHeader className="pb-2">
				<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
					<div>
						<CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
						<p className="text-lg text-muted-foreground mt-1">{job.jobTitle}</p>
					</div>
					<Badge className="w-fit text-sm px-3 py-1  capitalize">
						{formatJobType(job.type)}
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<Building className="h-5 w-5 text-muted-foreground" />
						<span className="text-lg">{job.company}</span>
					</div>

					<div className="flex items-center gap-2">
						<MapPin className="h-5 w-5 text-muted-foreground" />
						<span className="text-lg">{job.location}</span>
					</div>

					<div className="flex items-center gap-2">
						<Clock className="h-5 w-5 text-muted-foreground" />
						<span className="text-lg">
							Posted on {new Date(job.createdAt).toLocaleDateString()}
						</span>
					</div>
				</div>

				<div className="pt-4 border-t">
					<h3 className="text-xl font-semibold mb-3">Job Description</h3>
					<div className="prose max-w-none">
						<RichTextEditor editable={false} content={job.description} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
