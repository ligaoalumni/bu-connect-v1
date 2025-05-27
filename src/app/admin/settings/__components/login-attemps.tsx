"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Button,
	Input,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Badge,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components";
import {
	RefreshCw,
	Search,
	ChevronLeft,
	ChevronRight,
	Loader2,
} from "lucide-react";
import type { LoginLog } from "@prisma/client";
import { readLoginLogsAction } from "@/actions";
import type { Pagination } from "@/types";
import { formatDate } from "date-fns";

interface LoginAttemptsProps {
	logs: LoginLog[];
	initialCount?: number;
}

interface PaginationState extends Pagination {
	totalCount: number;
	totalPages: number;
}

export default function LoginAttempts({
	logs = [],
	initialCount = 0,
}: LoginAttemptsProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"ALL" | "SUCCESS" | "FAILED"
	>("ALL");
	const [loginAttempts, setLoginAttempts] = useState<LoginLog[]>(logs);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState<PaginationState>({
		limit: 10,
		page: 1,
		totalCount: initialCount || logs.length,
		totalPages: Math.ceil((initialCount || logs.length) / 10),
	});

	// Debounced search effect
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (statusFilter === "ALL" && searchQuery === "") {
				setLoginAttempts(logs); // Reset to initial logs if no filter
				return;
			}
			if (searchQuery !== "" || statusFilter !== "ALL") {
				handleFetchLogs(1); // Reset to first page when searching
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchQuery, statusFilter]);

	const handleFetchLogs = async (page?: number) => {
		try {
			setLoading(true);

			const currentPage = page || pagination.page;
			const status =
				statusFilter === "ALL" ? undefined : [statusFilter === "SUCCESS"];

			const result = await readLoginLogsAction({
				pagination: {
					limit: pagination.limit,
					page: currentPage - 1, // Convert to 0-based for backend
				},
				filter: searchQuery || undefined,
				status,
			});

			setLoginAttempts(result.data);
			setPagination((prev) => ({
				...prev,
				page: currentPage,
				totalCount: result.count,
				totalPages: Math.ceil(result.count / prev.limit),
			}));
		} catch (error) {
			console.error("Failed to fetch login logs:", error);
			// Fallback to initial data on error
			setLoginAttempts(logs);
			setPagination((prev) => ({
				...prev,
				totalCount: logs.length,
				totalPages: Math.ceil(logs.length / prev.limit),
			}));
		} finally {
			setLoading(false);
		}
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			handleFetchLogs(newPage);
		}
	};

	const handlePageSizeChange = (newLimit: string) => {
		const limit = Number.parseInt(newLimit);
		setPagination((prev) => ({
			...prev,
			limit,
			page: 1,
			totalPages: Math.ceil(prev.totalCount / limit),
		}));
		handleFetchLogs(1);
	};

	const handleRefresh = () => {
		handleFetchLogs(pagination.page);
	};

	const handleSearch = (value: string) => {
		setSearchQuery(value);
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	const handleStatusFilter = (value: string) => {
		setStatusFilter(value as "ALL" | "SUCCESS" | "FAILED");
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	// Calculate display range
	const startIndex = (pagination.page - 1) * pagination.limit + 1;
	const endIndex = Math.min(
		pagination.page * pagination.limit,
		pagination.totalCount
	);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>Recent Login Attempts</CardTitle>
						<CardDescription>
							View recent login attempts to monitor for suspicious activity.
						</CardDescription>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={handleRefresh}
						disabled={loading}>
						{loading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<RefreshCw className="mr-2 h-4 w-4" />
						)}
						Refresh
					</Button>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
						<div className="flex items-center gap-2 w-full md:w-1/2">
							<Search className="h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search by email, IP, or device..."
								value={searchQuery}
								onChange={(e) => handleSearch(e.target.value)}
								className="w-full"
								disabled={loading}
							/>
						</div>

						<div className="flex items-center gap-2 w-full md:w-1/2">
							<Select
								value={statusFilter}
								onValueChange={handleStatusFilter}
								disabled={loading}>
								<SelectTrigger>
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">All Statuses</SelectItem>
									<SelectItem value="SUCCESS">Success</SelectItem>
									<SelectItem value="FAILED">Failed</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Email</TableHead>
									<TableHead>IP Address</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Time</TableHead>
									<TableHead>Device</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{loading ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center py-8">
											<div className="flex items-center justify-center gap-2">
												<Loader2 className="h-4 w-4 animate-spin" />
												<span className="text-muted-foreground">
													Loading login attempts...
												</span>
											</div>
										</TableCell>
									</TableRow>
								) : loginAttempts.length > 0 ? (
									loginAttempts.map((attempt) => (
										<TableRow key={attempt.id}>
											<TableCell className="font-medium">
												{attempt.email}
											</TableCell>
											<TableCell>{attempt.ipAddress.split(":")[3]}</TableCell>
											<TableCell>
												{attempt.status ? (
													<Badge
														variant="default"
														className="bg-green-500 hover:bg-green-600">
														Success
													</Badge>
												) : (
													<Badge variant="destructive">Failed</Badge>
												)}
											</TableCell>
											<TableCell>
												{formatDate(attempt.createdAt, "MMM dd, yyyy HH:mm")}
											</TableCell>
											<TableCell className="truncate max-w-[200px]">
												{attempt.browser}/{attempt.device || "Unknown Device"}
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center py-8 text-muted-foreground">
											No login attempts found matching your criteria
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
					<div className="flex items-center gap-4">
						<div className="text-sm text-muted-foreground">
							{pagination.totalCount > 0 ? (
								<>
									Showing {startIndex}-{endIndex} of {pagination.totalCount}{" "}
									login attempts
								</>
							) : (
								"No login attempts found"
							)}
						</div>
						<div className="flex items-center gap-2">
							<Select
								value={pagination.limit.toString()}
								onValueChange={handlePageSizeChange}
								disabled={loading}>
								<SelectTrigger className="w-20">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="5">5</SelectItem>
									<SelectItem value="10">10</SelectItem>
									<SelectItem value="20">20</SelectItem>
									<SelectItem value="50">50</SelectItem>
								</SelectContent>
							</Select>
							<span className="text-sm text-muted-foreground">per page</span>
						</div>
					</div>

					{pagination.totalPages > 1 && (
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handlePageChange(pagination.page - 1)}
								disabled={pagination.page === 1 || loading}>
								<ChevronLeft className="h-4 w-4" />
								Previous
							</Button>

							<div className="flex items-center gap-1">
								{pagination.totalPages <= 7 ? (
									// Show all pages if 7 or fewer
									Array.from(
										{ length: pagination.totalPages },
										(_, i) => i + 1
									).map((page) => (
										<Button
											key={page}
											variant={page === pagination.page ? "default" : "outline"}
											size="sm"
											onClick={() => handlePageChange(page)}
											disabled={loading}
											className="w-8 h-8 p-0">
											{page}
										</Button>
									))
								) : (
									// Show truncated pagination for more than 7 pages
									<>
										{pagination.page > 3 && (
											<>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handlePageChange(1)}
													disabled={loading}
													className="w-8 h-8 p-0">
													1
												</Button>
												{pagination.page > 4 && (
													<span className="text-muted-foreground">...</span>
												)}
											</>
										)}

										{Array.from(
											{ length: Math.min(5, pagination.totalPages) },
											(_, i) => {
												const page = Math.max(
													1,
													Math.min(
														pagination.page - 2 + i,
														pagination.totalPages - 4 + i
													)
												);
												return page;
											}
										)
											.filter(
												(page, index, array) => array.indexOf(page) === index
											)
											.slice(0, 5)
											.map((page) => (
												<Button
													key={page}
													variant={
														page === pagination.page ? "default" : "outline"
													}
													size="sm"
													onClick={() => handlePageChange(page)}
													disabled={loading}
													className="w-8 h-8 p-0">
													{page}
												</Button>
											))}

										{pagination.page < pagination.totalPages - 2 && (
											<>
												{pagination.page < pagination.totalPages - 3 && (
													<span className="text-muted-foreground">...</span>
												)}
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														handlePageChange(pagination.totalPages)
													}
													disabled={loading}
													className="w-8 h-8 p-0">
													{pagination.totalPages}
												</Button>
											</>
										)}
									</>
								)}
							</div>

							<Button
								variant="outline"
								size="sm"
								onClick={() => handlePageChange(pagination.page + 1)}
								disabled={pagination.page === pagination.totalPages || loading}>
								Next
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
