"use client";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { publicRoutes } from "@/constant";
import { User } from "@/types";
import { AvatarDropdown } from "./avatar-dropdown";
import Image from "next/image";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { ThemeSwitcher } from "./theme-switcher";

const showMainNavRoutes = publicRoutes.concat(["/verify-account", "/"]);
const routes = ["#home", "#batch", "#about-us", "#events", "#contact-us"];

export function MainNav({
	user,
}: {
	user: Pick<
		User,
		"firstName" | "lastName" | "email" | "role" | "id" | "avatar"
	> | null;
}) {
	const path = usePathname();
	const { login, logout } = useAuth();

	useEffect(() => {
		if (user) {
			login(user);
		} else {
			logout();
		}
	}, [user]);

	return showMainNavRoutes.includes(path) ? (
		<header className="absolute top-2  md:top-10 z-50 w-screen  bg-transparent   ">
			<div className="mx-auto container  justify-between  px-5 md:px-0 flex h-14  items-center">
				<div className="mr-4 hidden md:flex">
					<Link href="/" className="mr-6 flex items-center space-x-2">
						<Image src="/icon.svg" height={100} width={100} alt="LNHS Logo" />
					</Link>
				</div>
				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="md:hidden border-none bg-primary ">
							<Menu className="h-5 w-5 text-white" />
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

				{path !== "/verify-account" && (
					<div className="hidden md:flex gap-5 items-center ">
						{routes.map((route) => (
							<Link
								key={route}
								href={route}
								className="text-sm font-medium leading-none text-white capitalize hover:text-primary transition-colors duration-200 ease-in-out">
								{route.replace("#", "").replaceAll("-", " ").toLowerCase()}
							</Link>
						))}
					</div>
				)}
				<div className="flex  items-center  justify-end space-x-2">
					{/* <ThemeSwitcher /> */}
					{user && user.id ? (
						<>
							<ThemeSwitcher />
							<AvatarDropdown />
						</>
					) : (
						<nav className="flex items-center space-x-2">
							<Button
								asChild
								variant="outline"
								className="bg-transparent text-white border-white rounded-sm">
								<Link href="/login">Log In</Link>
							</Button>
						</nav>
					)}
				</div>
			</div>
		</header>
	) : null;
}
