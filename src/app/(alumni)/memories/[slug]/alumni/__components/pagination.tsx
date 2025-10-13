import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	baseUrl: string;
	showPageNumbers?: boolean;
}

export function Pagination({
	currentPage,
	totalPages,
	baseUrl,
	showPageNumbers = true,
}: PaginationProps) {
	const hasNextPage = currentPage < totalPages;
	const hasPrevPage = currentPage > 1;

	// Generate page numbers to show
	const getPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			const start = Math.max(1, currentPage - 2);
			const end = Math.min(totalPages, start + maxVisiblePages - 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}
		}

		return pages;
	};

	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-between mt-8">
			<div className="flex items-center gap-2">
				<Link
					href={`${baseUrl}${hasPrevPage ? `?page=${currentPage - 1}` : ""}`}
					className={!hasPrevPage ? "pointer-events-none" : ""}>
					<Button
						variant="outline"
						disabled={!hasPrevPage}
						className="flex items-center gap-2">
						<ChevronLeft className="h-4 w-4" />
						Previous
					</Button>
				</Link>

				{showPageNumbers && (
					<div className="flex items-center gap-1">
						{getPageNumbers().map((pageNum) => (
							<Link key={pageNum} href={`${baseUrl}?page=${pageNum}`}>
								<Button
									variant={pageNum === currentPage ? "default" : "outline"}
									size="sm"
									className="w-10 h-10">
									{pageNum}
								</Button>
							</Link>
						))}
					</div>
				)}

				<Link
					href={`${baseUrl}${hasNextPage ? `?page=${currentPage + 1}` : ""}`}
					className={!hasNextPage ? "pointer-events-none" : ""}>
					<Button
						variant="outline"
						disabled={!hasNextPage}
						className="flex items-center gap-2">
						Next
						<ChevronRight className="h-4 w-4" />
					</Button>
				</Link>
			</div>

			<div className="flex items-center gap-2">
				<span className="text-sm text-gray-600">
					Page {currentPage} of {totalPages}
				</span>
			</div>
		</div>
	);
}
