import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components";

export default async function DashboardOverview() {
	// const overview = await dashboardOverviewAction();

	return (
		<section className="mt-6">
			<h2 className="text-2xl font-bold tracking-tight mb-4">Overview</h2>
			<div className="grid gap-4 md:grid-cols-3">
				{/* <OverviewCard
					Icon={GraduationCap}
					title="Total Alumni Rec"
					change={`${overview.alumniRecord.percentage}%: has accounts`}
					value={overview.alumniRecord.total.toString()}
				/>
				<OverviewCard
					Icon={Users}
					title="Alumni"
					change={`+${overview.alumni.percentage}%: from last month`}
					value={overview.alumni.total.toString()}
				/>
				<OverviewCard
					Icon={GraduationCap}
					title="Events"
					change={`+${overview.events.percentage}%: from last month`}
					value={overview.events.total.toFixed(2)}
				/> */}
			</div>
		</section>
	);
}

export const OverviewCard = ({
	change,
	Icon,
	title,
	value,
}: {
	title: string;
	value: string;
	Icon: LucideIcon;
	change: string;
}) => {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{<Icon />}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<p className="text-xs text-muted-foreground mt-1">
					<span
						className={
							change.startsWith("+") ? "text-green-500" : "text-primary"
						}>
						{change.split(":")[0]}
					</span>
					<span className="text-muted-foreground">{change.split(":")[1]}</span>
				</p>
			</CardContent>
		</Card>
	);
};
