import type React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib";

interface LoadingOverlayProps {
	isLoading?: boolean;
	children?: React.ReactNode;
	className?: string;
}

export function LoadingOverlay({
	isLoading = false,
	children,
	className,
}: LoadingOverlayProps) {
	return (
		<div className={cn("relative", className)}>
			{children}
			{isLoading && (
				<div
					className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
					role="status"
					aria-label="Loading">
					<div className="flex flex-col items-center gap-2">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<span className="text-sm text-muted-foreground">Loading...</span>
					</div>
				</div>
			)}
		</div>
	);
}
