"use client";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

interface PaginationButtonProps {
	currentPage: number;
	totalPages: number;
	pageSize: number;
}

export function PaginationButton({
	currentPage,
	totalPages,
	pageSize,
}: PaginationButtonProps) {
	const searchParams = useSearchParams();

	const createPageURL = (pageNumber: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", pageNumber.toString());
		params.set("limit", pageSize.toString());
		return `?${params.toString()}`;
	};

	return (
		<Pagination>
			<PaginationContent>
				{currentPage > 1 && (
					<PaginationItem>
						<PaginationPrevious href={createPageURL(currentPage - 1)} />
					</PaginationItem>
				)}

				{[...Array(totalPages)].map((_, i) => {
					const pageNumber = i + 1;
					// Show first page, current page, last page, and pages around current
					if (
						pageNumber === 1 ||
						pageNumber === totalPages ||
						(pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
					) {
						return (
							<PaginationItem key={pageNumber}>
								<PaginationLink
									href={createPageURL(pageNumber)}
									isActive={pageNumber === currentPage}>
									{pageNumber}
								</PaginationLink>
							</PaginationItem>
						);
					}

					// Show ellipsis for gaps
					if (
						(pageNumber === currentPage - 2 && pageNumber > 2) ||
						(pageNumber === currentPage + 2 && pageNumber < totalPages - 1)
					) {
						return (
							<PaginationItem key={pageNumber}>
								<PaginationEllipsis />
							</PaginationItem>
						);
					}

					return null;
				})}

				{currentPage < totalPages && (
					<PaginationItem>
						<PaginationNext href={createPageURL(currentPage + 1)} />
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	);
}
