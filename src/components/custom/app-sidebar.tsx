import * as React from "react";
import { LayoutDashboard, Minus, Plus, QrCode } from "lucide-react";

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
			url: "/dashboard",
		},
		{
			title: "Community",
			url: "#",
			items: [
				{
					title: "Contribution Guide",
					url: "#",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
													{item.title}
													<Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
													<Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
												</SidebarMenuButton>
											</CollapsibleTrigger>
											{item.items?.length ? (
												<CollapsibleContent>
													<SidebarMenuSub>
														{item.items.map((item) => (
															<SidebarMenuSubItem key={item.title}>
																<SidebarMenuSubButton
																	asChild
																	// isActive={item.isActive}
																>
																	<div>
																		{/* TODO: ADD ICON */}
																		<Link href={item.url}>{item.title}</Link>
																	</div>
																</SidebarMenuSubButton>
															</SidebarMenuSubItem>
														))}
													</SidebarMenuSub>
												</CollapsibleContent>
											) : null}
										</SidebarMenuItem>
									</Collapsible>
								);
							} else {
								return (
									<SidebarMenuItem key={index}>
										<SidebarMenuButton>{item.title}</SidebarMenuButton>
									</SidebarMenuItem>
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
