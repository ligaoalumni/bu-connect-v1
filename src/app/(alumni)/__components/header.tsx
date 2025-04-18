import {
	AvatarDropdown,
	Button,
	Sheet,
	SheetContent,
	SheetTrigger,
	ThemeSwitcher,
} from "@/components";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export function Header() {
	return (
		<header className="bg-[#2F61A0] shadow-md dark:bg-[#5473a8] h-24 sticky top-0 py-2 z-50 w-screen   ">
			<div className="mx-auto container px-5 md:px-0 flex justify-between   items-center">
				<div className="mr-4  hidden md:flex">
					<Link href="/" className="mr-6 flex items-center space-x-2">
						<Image src="/icon.svg" height={80} width={80} alt="LNHS Logo" />
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

				<div className="hidden md:flex items-center ">
					<Link
						href="/"
						className="mr-6 flex items-center space-x-2 text-white">
						Home
					</Link>
					<Link
						href="/batch"
						className="mr-6 flex items-center space-x-2 text-white">
						Batch
					</Link>
					<Link
						href="/events"
						className="mr-6 flex items-center space-x-2 text-white">
						Events
					</Link>
					<Link
						href="/announcements"
						className="mr-6 flex items-center space-x-2 text-white">
						Announcements
					</Link>
					<Link
						href="#contact-us"
						className="mr-6 flex items-center space-x-2 text-white">
						Contact us
					</Link>
					<Link
						href="#about-us"
						className="mr-6 flex items-center space-x-2 text-white">
						About us
					</Link>
				</div>
				<div className="flex   items-center justify-end space-x-2">
					<ThemeSwitcher />
					<AvatarDropdown />
				</div>
			</div>
		</header>
	);
}
