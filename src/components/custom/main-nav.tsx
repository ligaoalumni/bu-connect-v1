"use client";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { publicRoutes } from "@/constant";
import { User } from "@/types";
import { AvatarDropdown } from "./avatar-dropdown";
import { ThemeSwitcher } from "./theme-switcher";

const components: { title: string; href: string; description: string }[] = [
	{
		title: "All Events",
		href: "/all-events",
		description: "Browse all events with comprehensive details.",
	},
	{
		title: "Upcoming Events",
		href: "/upcoming-events",
		description: "Discover upcoming events and their schedules.",
	},
	{
		title: "Past Events",
		href: "/past-events",
		description: "Review past events and notable highlights.",
	},
	// {
	// 	title: "Ongoing Events",
	// 	href: "/ongoing-events",
	// 	description: "See events currently in progress with live updates.",
	// },
];

export function MainNav({
	user,
}: {
	user: Pick<User, "firstName" | "lastName" | "email" | "role" | "id"> | null;
}) {
	const path = usePathname();

	return publicRoutes.includes(path) ? (
		<header className="sticky container mx-auto top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<div className="mr-4 hidden md:flex">
					<Link href="/" className="mr-6 flex items-center space-x-2">
						<span className="hidden font-bold sm:inline-block">
							LNHS | Alumni Tracker
						</span>
					</Link>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<Link href="/" legacyBehavior passHref>
									<NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
										Home
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							{/*<NavigationMenuItem>
								<NavigationMenuTrigger>Events</NavigationMenuTrigger>
								
								 <NavigationMenuContent>
									<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
										<li className="row-span-3">
											<NavigationMenuLink asChild>
												<Link
													className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
													href="/">
													<div className="mb-2 mt-4 text-lg font-medium">
														Getting Started
													</div>
													<p className="text-sm leading-tight text-muted-foreground">
														Learn about our products and services.
													</p>
												</Link>
											</NavigationMenuLink>
										</li>
										<li>
											<NavigationMenuLink asChild>
												<a
													className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
													href="/docs">
													<div className="text-sm font-medium leading-none">
														Documentation
													</div>
													<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
														Start integrating our products and services.
													</p>
												</a>
											</NavigationMenuLink>
										</li>
										<li>
											<NavigationMenuLink asChild>
												<a
													className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
													href="/guides">
													<div className="text-sm font-medium leading-none">
														Guides
													</div>
													<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
														Best practices and examples to get you started.
													</p>
												</a>
											</NavigationMenuLink>
										</li>
									</ul>
								</NavigationMenuContent> 
							</NavigationMenuItem>*/}
							<NavigationMenuItem>
								<NavigationMenuTrigger>Events</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
										{components.map((component) => (
											<li key={component.title}>
												<NavigationMenuLink asChild>
													<a
														className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
														href={component.href}>
														<div className="text-sm font-medium leading-none">
															{component.title}
														</div>
														<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
															{component.description}
														</p>
													</a>
												</NavigationMenuLink>
											</li>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/about" legacyBehavior passHref>
									<NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
										About
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon" className="md:hidden">
							<Menu className="h-5 w-5" />
							<span className="sr-only">Toggle navigation menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left">
						<div className="grid gap-4 py-4">
							<Link href="/" className="text-sm font-medium leading-none">
								Home
							</Link>
							<Link href="/docs" className="text-sm font-medium leading-none">
								Documentation
							</Link>
							<Link
								href="/components"
								className="text-sm font-medium leading-none">
								Components
							</Link>
							<Link href="/about" className="text-sm font-medium leading-none">
								About
							</Link>
						</div>
					</SheetContent>
				</Sheet>
				<div className="flex flex-1 items-center justify-end space-x-4">
					<ThemeSwitcher />
					{user && user.id ? (
						<AvatarDropdown isAdmin={user.role !== "ALUMNI"} />
					) : (
						<nav className="flex items-center space-x-2">
							<Button asChild>
								<Link href="/login">Log In</Link>
							</Button>
						</nav>
					)}
				</div>
			</div>
		</header>
	) : null;
}
