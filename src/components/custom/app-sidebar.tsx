import * as React from "react";
import {
	CalendarDays,
	CalendarPlus,
	ChevronDown,
	ChevronUp,
	Cog,
	GraduationCap,
	LayoutDashboard,
	ListOrdered,
	QrCode,
	UserCog,
	UserPlus,
	Users,
} from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";

// This is sample data.
const data = {
	navMain: [
		{
			icon: LayoutDashboard,
			title: "Dashboard",
			url: "/dashboard",
		},
		{
			icon: CalendarDays,
			title: "Events",
			url: "#",
			items: [
				{
					icon: CalendarPlus,
					title: "Add New Event",
					url: "/events/add-new-event",
				},
				{
					icon: ListOrdered,
					title: "List",
					url: "/events",
				},
			],
		},
		{
			icon: GraduationCap,
			title: "Alumni",
			url: "/alumni",
		},
		{
			icon: UserCog,
			title: "Admins",
			url: "#",
			items: [
				{
					icon: UserPlus,
					title: "Add New	Admin",
					url: "/admins/add-new-admin",
				},
				{
					icon: Users,
					title: "List",
					url: "/admins",
				},
			],
		},
		{
			icon: Cog,
			title: "Settings",
			url: "/settings",
		},
	],
};

export function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar> & { pathname: string }) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="#">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<QrCode className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-semibold">Alumni Tracking System</span>
									<span className="">Ligao National High School</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				{/* <SearchForm /> */}
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{data.navMain.map((item, index) => {
							if (item.items && item.items.length > 0) {
								return (
									<Collapsible
										key={item.title}
										defaultOpen={index === 1}
										className="group/collapsible">
										<SidebarMenuItem>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton>
													<item.icon />
													{item.title}
													<ChevronDown className="ml-auto group-data-[state=open]/collapsible:hidden" />
													<ChevronUp className="ml-auto group-data-[state=closed]/collapsible:hidden" />
												</SidebarMenuButton>
											</CollapsibleTrigger>
											{item.items?.length ? (
												<CollapsibleContent>
													<SidebarMenuSub>
														{item.items.map((item) => (
															<Link href={item.url} key={item.title}>
																<SidebarMenuSubItem>
																	<SidebarMenuSubButton
																		asChild
																		isActive={item.url === props.pathname}>
																		<div>
																			{<item.icon />}
																			{item.title}
																		</div>
																	</SidebarMenuSubButton>
																</SidebarMenuSubItem>
															</Link>
														))}
													</SidebarMenuSub>
												</CollapsibleContent>
											) : null}
										</SidebarMenuItem>
									</Collapsible>
								);
							} else {
								return (
									<Link href={item.url} key={index}>
										<SidebarMenuItem>
											<SidebarMenuButton
												asChild
												isActive={item.url === props.pathname}>
												<div>
													{<item.icon />}
													{item.title}
												</div>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</Link>
								);
							}
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
