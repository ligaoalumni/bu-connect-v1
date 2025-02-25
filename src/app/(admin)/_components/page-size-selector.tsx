"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const pageSizeOptions = [10, 20, 30, 50];

export function PageSizeSelector({
	currentPageSize,
	total,
}: {
	currentPageSize: number;
	total: number;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handlePageSizeChange = (value: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("limit", value);
		params.set("page", "1"); // Reset to first page when changing page size
		router.push(`?${params.toString()}`);
	};

	return (
		<div className="   flex sm:min-w-[250px] items-center gap-2">
			<span className="text-sm   text-muted-foreground">Rows per page</span>
			<Select
				value={currentPageSize.toString()}
				onValueChange={handlePageSizeChange}>
				<SelectTrigger className="w-[80px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{pageSizeOptions.map((size) => (
						<SelectItem
							disabled={size > total}
							key={size}
							value={size.toString()}>
							{size}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
