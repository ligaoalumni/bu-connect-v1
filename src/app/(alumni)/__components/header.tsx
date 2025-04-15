import {
	AvatarDropdown,
	Button,
	Sheet,
	SheetContent,
	SheetTrigger,
} from "@/components";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export function Header() {
	return (
		<header className="bg-[#2F61A0] dark:bg-[#5473a8] sticky top-0 py-2 z-50 w-screen   ">
			<div className="mx-auto container px-5 md:px-0 flex   items-center">
				<div className="mr-4  hidden md:flex">
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
				<div className="flex flex-1 items-center justify-end space-x-2">
					<AvatarDropdown />
				</div>
			</div>
		</header>
	);
}
