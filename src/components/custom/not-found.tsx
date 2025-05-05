import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface NotFoundComponentProps {
	title: string;
	description?: string;
	backTo: string;
	backLabel: string;
}

export function NotFoundComponent({
	title,
	description = "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.",
	backTo = "/",
	backLabel = "Back to Home",
}: NotFoundComponentProps) {
	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center bg-background px-4 text-center">
			<div className="max-w-md space-y-6">
				<div className="space-y-2">
					<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
						{title}
					</h1>
					<p className="text-muted-foreground">{description}</p>
				</div>
				<Button asChild className="gap-2">
					<Link href={backTo}>
						<ArrowLeft className="h-4 w-4" />
						{backLabel}
					</Link>
				</Button>
			</div>
		</div>
	);
}
