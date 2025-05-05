import { DashboardEventSectionSkeleton } from "./_components/dashboard-event-section";
import { lazy, Suspense } from "react";
import DashboardOverview from "./_components/dashboard-overview";

const DashboardEventSection = lazy(
	() => import("./_components/dashboard-event-section")
);

export default async function Dashboard() {
	return (
		<div className="flex  w-full  ">
			<div className="flex-1">
				<div className="grid gap-5">
					{/* Today's Events Section */}
					<Suspense fallback={<DashboardEventSectionSkeleton />}>
						<DashboardEventSection />
					</Suspense>

					{/* Overview */}
					<DashboardOverview />

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
