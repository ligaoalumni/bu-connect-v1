import * as React from "react";
import {
	Briefcase,
	CalendarDays,
	CalendarPlus,
	ChevronDown,
	ChevronUp,
	Cog,
	FilePlus,
	Files,
	FileStack,
	GraduationCap,
	Info,
	LayoutDashboard,
	ListOrdered,
	Plus,
	QrCode,
	Tally5,
	UserCog,
	UserPlus,
	UserPlus2,
	Users,
	Users2,
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
} from "@/components/ui/sidebar";
import Link from "next/link";

// This is sample data.
const data = {
	navMain: [
		{
			icon: LayoutDashboard,
			title: "Dashboard",
			url: "/admin",
		},
		{
			icon: CalendarDays,
			title: "Events",
			url: "#",
			items: [
				{
					icon: CalendarPlus,
					title: "Add",
					url: "/admin/events/add-new-event",
				},
				{
					icon: ListOrdered,
					title: "List",
					url: "/admin/events",
				},
			],
		},
		{
			icon: Info,
			title: "Announcements",
			url: "#",
			items: [
				{
					icon: Plus,
					title: "Add",
					url: "/admin/announcements/add",
				},
				{
					icon: ListOrdered,
					title: "List",
					url: "/admin/announcements",
				},
			],
		},
		{
			icon: Briefcase,
			title: "Jobs",
			url: "#",
			items: [
				{
					icon: FilePlus,
					title: "Add",
					url: "/admin/jobs/add",
				},
				{
					icon: Files,
					title: "List",
					url: "/admin/jobs",
				},
			],
		},
		{
			icon: Tally5,
			title: "Polls",
			url: "#",
			items: [
				{
					icon: FilePlus,
					title: "Add",
					url: "/admin/polls/add",
				},
				{
					icon: FileStack,
					title: "List",
					url: "/admin/polls",
				},
			],
		},
		{
			icon: GraduationCap,
			title: "Alumni",
			url: "#",
			items: [
				{
					icon: UserPlus2,
					title: "Add",
					url: "/admin/alumni/add",
				},
				{
					icon: Users2,
					title: "List",
					url: "/admin/alumni",
				},
			],
		},
		{
			icon: UserCog,
			title: "Admins",
			url: "#",
			items: [
				{
					icon: UserPlus,
					title: "Add",
					url: "/admin/list/add-new",
				},
				{
					icon: Users,
					title: "List",
					url: "/admin/list",
				},
			],
		},
		{
			icon: Cog,
			title: "Settings",
			url: "/admin/settings",
		},
	],
};

export function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar> & {
	pathname: string;
	isSuperAdmin?: false;
}) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="text-white ">
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
										<SidebarMenuItem className="text-white">
											<CollapsibleTrigger asChild>
												<SidebarMenuButton>
													<item.icon />
													{item.title}
													<ChevronDown className="ml-auto group-data-[state=open]/collapsible:hidden" />
													<ChevronUp className="ml-auto group-data-[state=closed]/collapsible:hidden" />
												</SidebarMenuButton>
											</CollapsibleTrigger>
											{item.items?.length ? (
												<CollapsibleContent className="">
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
									<Link href={item.url} key={index} className="text-white">
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
