import { Calendar, GraduationCap, MessageSquare, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components";
import { DashboardEventSectionSkeleton } from "./_components/dashboard-event-section";
import { lazy, Suspense } from "react";

const DashboardEventSection = lazy(
	() => import("./_components/dashboard-event-section")
);

export default async function Dashboard() {
	// const recentAlumni = [
	// 	{
	// 		id: 1,
	// 		name: "Alex Johnson",
	// 		batch: "2022",
	// 		location: "New York",
	// 		company: "Google",
	// 		avatar: "/placeholder.svg?height=40&width=40",
	// 	},
	// 	{
	// 		id: 2,
	// 		name: "Sarah Williams",
	// 		batch: "2021",
	// 		location: "San Francisco",
	// 		company: "Apple",
	// 		avatar: "/placeholder.svg?height=40&width=40",
	// 	},
	// 	{
	// 		id: 3,
	// 		name: "Michael Chen",
	// 		batch: "2022",
	// 		location: "Seattle",
	// 		company: "Amazon",
	// 		avatar: "/placeholder.svg?height=40&width=40",
	// 	},
	// 	{
	// 		id: 4,
	// 		name: "Emma Davis",
	// 		batch: "2020",
	// 		location: "Boston",
	// 		company: "Microsoft",
	// 		avatar: "/placeholder.svg?height=40&width=40",
	// 	},
	// ];

	const stats = [
		{
			title: "Total Alumni",
			value: "5,234",
			icon: GraduationCap,
			change: "+12%",
		},
		{ title: "Active Alumni", value: "3,879", icon: Users, change: "+5%" },
		{ title: "Events This Month", value: "8", icon: Calendar, change: "+2" },
		{ title: "Messages", value: "142", icon: MessageSquare, change: "+24%" },
	];

	return (
		<div className="flex  w-full  ">
			<div className="flex-1">
				<div className="grid gap-5">
					{/* Today's Events Section */}
					<Suspense fallback={<DashboardEventSectionSkeleton />}>
						<DashboardEventSection />
					</Suspense>
					{/* <DashboardEventSectionSkeleton /> */}

					{/* Stats Overview */}
					<section className="mt-6">
						<h2 className="text-2xl font-bold tracking-tight mb-4">Overview</h2>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							{stats.map((stat, index) => (
								<Card key={index}>
									<CardHeader className="flex flex-row items-center justify-between pb-2">
										<CardTitle className="text-sm font-medium">
											{stat.title}
										</CardTitle>
										<stat.icon className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{stat.value}</div>
										<p className="text-xs text-muted-foreground mt-1">
											<span
												className={
													stat.change.startsWith("+")
														? "text-green-500"
														: "text-red-500"
												}>
												{stat.change}
											</span>{" "}
											from last month
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					</section>

					{/* Tabs for different views */}
					{/* <section className="mt-6">
						<Tabs defaultValue="recent">
							<div className="flex items-center justify-between mb-4">
								<TabsList>
									<TabsTrigger value="recent">Recent Alumni</TabsTrigger>
									<TabsTrigger value="engagement">Engagement</TabsTrigger>
									<TabsTrigger value="employment">Employment</TabsTrigger>
								</TabsList>
								<Button variant="outline" size="sm">
									<Users className="mr-2 h-4 w-4" />
									View All Alumni
								</Button>
							</div>
							<TabsContent value="recent" className="space-y-4">
								<Card>
									<CardHeader>
										<CardTitle>Recently Updated Alumni Profiles</CardTitle>
										<CardDescription>
											Alumni who have updated their profiles in the last 30 days
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{recentAlumni.map((alumni) => (
												<div
													key={alumni.id}
													className="flex items-center justify-between">
													<div className="flex items-center gap-3">
														<Avatar>
															<AvatarImage
																src={alumni.avatar}
																alt={alumni.name}
															/>
															<AvatarFallback>
																{alumni.name.charAt(0)}
															</AvatarFallback>
														</Avatar>
														<div>
															<p className="font-medium">{alumni.name}</p>
															<p className="text-sm text-muted-foreground">
																Class of {alumni.batch}
															</p>
														</div>
													</div>
													<div className="text-right">
														<p className="text-sm">{alumni.company}</p>
														<p className="text-xs text-muted-foreground">
															{alumni.location}
														</p>
													</div>
												</div>
											))}
										</div>
									</CardContent>
									<CardFooter>
										<Button variant="ghost" size="sm" className="w-full">
											Load More
										</Button>
									</CardFooter>
								</Card>
							</TabsContent>
							<TabsContent value="engagement">
								<Card>
									<CardHeader>
										<CardTitle>Alumni Engagement</CardTitle>
										<CardDescription>
											Track alumni participation in events and programs
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="h-[300px] flex items-center justify-center">
											<BarChart3 className="h-16 w-16 text-muted-foreground" />
											<p className="ml-4 text-muted-foreground">
												Engagement analytics would appear here
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
							<TabsContent value="employment">
								<Card>
									<CardHeader>
										<CardTitle>Employment Statistics</CardTitle>
										<CardDescription>
											Track alumni employment across industries and regions
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="h-[300px] flex items-center justify-center">
											<BarChart3 className="h-16 w-16 text-muted-foreground" />
											<p className="ml-4 text-muted-foreground">
												Employment statistics would appear here
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</section> */}
				</div>
			</div>
		</div>
	);
}
