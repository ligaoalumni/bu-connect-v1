"use client";

import {
	AppSidebar,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Separator,
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
	ThemeSwitcher,
	AvatarDropdown,
} from "@/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, ReactNode } from "react";

export default function AdminLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const pathname = usePathname();

	const segments = pathname.split("/").filter(Boolean);

	// Create the breadcrumb items
	const breadcrumbItems = segments.map((segment, index) => {
		// Create the href for this segment
		const href = `/${segments.slice(0, index + 1).join("/")}`;

		// Check if this is the last segment
		const isLastSegment = index === segments.length - 1;

		// Format the segment text (capitalize and replace hyphens with spaces)
		const formattedSegment = segment
			.split("-")
			.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		return (
			<Fragment key={segment}>
				<BreadcrumbItem className="">
					{isLastSegment ? (
						<BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
					) : (
						<BreadcrumbLink className="hidden md:block" href={href} asChild>
							<Link href={href}>{formattedSegment}</Link>
						</BreadcrumbLink>
					)}
				</BreadcrumbItem>
				{!isLastSegment && <BreadcrumbSeparator className="hidden md:block" />}
			</Fragment>
		);
	});

	return (
		<SidebarProvider className="z-[1002]">
			<AppSidebar className="z-[1002]" pathname={pathname} />
			<SidebarInset>
				<header className="flex h-16 z-[1] shrink-0 backdrop-blur-lg sticky top-0 w-full items-center justify-between border-b px-4">
					<div className="flex items-center gap-2">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="/" asChild>
										<Link href="/">Home</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								{breadcrumbItems}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
					<div className="flex items-center gap-2">
						<ThemeSwitcher />
						<AvatarDropdown />
					</div>
				</header>
				<main className="flex flex-1 flex-col gap-4 p-4 lg:p-8 xl:px-12  ">
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
