"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	placeholder?: string;
}

export function SearchBar({
	searchTerm,
	onSearchChange,
	placeholder = "Search batches...",
}: SearchBarProps) {
	return (
		<div className="relative">
			<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
			<Input
				type="search"
				placeholder={placeholder}
				value={searchTerm}
				onChange={(e) => onSearchChange(e.target.value)}
				className="pl-9"
			/>
		</div>
	);
}
