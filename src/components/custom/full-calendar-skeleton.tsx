import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FCalendarSkeleton() {
	return (
		<div className="grid gap-4 w-full  xl:grid-cols-4">
			{/* Main Calendar Card */}
			<Card className="col-span-full ">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-48" />
						</div>
						<div className="flex items-center gap-4">
							<div className="flex items-center space-x-2">
								<Skeleton className="h-5 w-9 rounded-full" />
								<Skeleton className="h-4 w-24" />
							</div>
							{/* <Skeleton className="h-9 w-9" /> */}
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{/* Calendar Toolbar */}
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Skeleton className="h-9 w-9" />
							<Skeleton className="h-9 w-9" />
							<Skeleton className="h-9 w-20" />
						</div>
						<Skeleton className="h-9 w-32" />
						<div className="flex items-center gap-2">
							<Skeleton className="h-9 w-24" />
							<Skeleton className="h-9 w-24" />
							<Skeleton className="h-9 w-24" />
						</div>
					</div>

					{/* Calendar Grid */}
					<div className="grid grid-cols-7 gap-px rounded-lg border bg-muted">
						{/* Week days header */}
						{Array.from({ length: 7 }).map((_, i) => (
							<div key={`header-${i}`} className="bg-background p-2">
								<Skeleton className="h-4 w-12" />
							</div>
						))}

						{/* Calendar days */}
						{Array.from({ length: 35 }).map((_, i) => (
							<div key={`day-${i}`} className="min-h-[120px] bg-background p-2">
								{/* <Skeleton className="mb-2 h-6 w-6 rounded-full" /> */}
								{/* Event placeholders */}
								{Math.random() > 0.7 && (
									<div className="space-y-1">
										<Skeleton className="h-5 w-full" />
										<Skeleton className="h-5 w-4/5" />
									</div>
								)}
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
