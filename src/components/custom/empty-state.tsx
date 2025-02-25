import { FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { JSX } from "react";

interface EmptyStateProps {
	title?: string;
	description?: string;
	showRedirectButton?: boolean;
	redirectPath?: string;
	redirectLabel?: string;
	icon?: JSX.Element;
}

export function EmptyState({
	icon = <FileX className="h-28 w-28 text-muted-foreground" />,
	title = "No events found",
	description = "There are no events to display at the moment.",
	showRedirectButton = true,
	redirectLabel = "Create a new event",
	redirectPath = "/events/add-new-event",
}: EmptyStateProps) {
	return (
		<div className="flex min-h-[400px] flex-col items-center justify-center rounded-md     p-8 text-center animate-in fade-in-50">
			<div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
				<div className="flex h-40 w-40 items-center justify-center rounded-full bg-muted">
					{icon}
				</div>
				<h2 className="mt-6 text-2xl font-semibold">{title}</h2>
				<p className="mt-2 text-center text-md text-muted-foreground">
					{description}
				</p>
				{showRedirectButton && (
					<Button asChild className="mt-6">
						<Link href={redirectPath}>{redirectLabel}</Link>
					</Button>
				)}
			</div>
		</div>
	);
}
