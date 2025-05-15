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
	NotificationDropdown,
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
		let formattedSegment = segment
			.split("-")
			.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
		if (formattedSegment.toLowerCase() === "admin") {
			formattedSegment = "Dashboard";
		}
		return (
			<Fragment key={segment}>
				<BreadcrumbItem className="">
					{isLastSegment ? (
						<BreadcrumbPage className="text-white hover:text-white/80">
							{formattedSegment}
						</BreadcrumbPage>
					) : (
						<BreadcrumbLink className="hidden md:block" href={href} asChild>
							<Link className="text-white hover:text-white/80" href={href}>
								{formattedSegment}
							</Link>
						</BreadcrumbLink>
					)}
				</BreadcrumbItem>
				{!isLastSegment && (
					<BreadcrumbSeparator className="hidden text-white md:block" />
				)}
			</Fragment>
		);
	});

	return (
		<div className="bg-gradient-to-b from-[#001E54] via-[#005CA1] to-[#00BFFF] dark:from-[#000814] dark:via-[#001d3d] dark:to-[#003566]">
			<SidebarProvider className="z-[1002] bg-gradient-to-b from-[#001E54] via-[#005CA1] to-[#00BFFF] dark:from-[#000814] dark:via-[#001d3d] dark:to-[#003566] shadow-none">
				<AppSidebar className="border-none" pathname={pathname} />
				<SidebarInset className=" overflow-hidden min-h-[calc(100dvh)] max-h-[calc(100dvh)]   bg-transparent">
					<div className="max-w-[98%] min-w-[98%] overflow-x-hidden min-h-[calc(100dvh-4dvh)] max-h-[calc(100dvh-4dvh)]  overscroll-none bg-white  dark:bg-[#00356690] dark:shadow-2xl dark:shadow-black/30 relative scroll-smooth overflow-y-auto scrollbar-hide rounded-t-2xl mx-auto rounded-b-2xl   my-4">
						<header className="flex bg-[#2F61A0]  dark:bg-[#5473a8] rounded-2xl h-16 z-[1] shrink-0 backdrop-blur-lg sticky top-0 w-full px-4">
							<div className="flex items-center justify-between container mx-auto">
								<div className="flex items-center gap-2">
									<SidebarTrigger className="-ml-1 text-white" />
									<Separator orientation="vertical" className="mr-2 h-4" />
									<Breadcrumb>
										<BreadcrumbList>
											<BreadcrumbItem className="hidden text-white hover:text-white/80 /80 md:block">
												<BreadcrumbLink href="/" asChild>
													<Link href="/">Home</Link>
												</BreadcrumbLink>
											</BreadcrumbItem>
											<BreadcrumbSeparator className="hidden text-white md:block" />
											{breadcrumbItems}
										</BreadcrumbList>
									</Breadcrumb>
								</div>
								<div className="flex items-center gap-2">
									<ThemeSwitcher />
									<NotificationDropdown notifications={[]} />
									<AvatarDropdown />
								</div>
							</div>
						</header>
						<main className="flex flex-1 flex-col gap-4 p-4 lg:p-8 xl:px-12 container mx-auto  dark:text-gray-200">
							{children}
						</main>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
