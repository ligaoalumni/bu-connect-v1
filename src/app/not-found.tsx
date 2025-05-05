import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
			<div className="space-y-6 text-center">
				<h1 className="text-9xl font-extrabold tracking-tight text-primary">
					404
				</h1>
				<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
					Page not found
				</h2>
				<p className="max-w-md mx-auto text-muted-foreground">
					Sorry, we couldn&apos;t find the page you&apos;re looking for. The
					page might have been removed or the URL might be incorrect.
				</p>
				<Button asChild size="lg" className="gap-2">
					<Link href="/">
						<HomeIcon className="size-4" />
						Back to Home
					</Link>
				</Button>
			</div>
		</div>
	);
}
