import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export function TableSkeleton() {
	return (
		<div className="space-y-4">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							{/* Add other table headers based on your data structure */}
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...Array(10)].map((_, i) => (
							<TableRow key={i}>
								<TableCell>
									<Skeleton className="h-4 w-[100px]" />
								</TableCell>
								{/* Add other skeleton cells based on your data structure */}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
