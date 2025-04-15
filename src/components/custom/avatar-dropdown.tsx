"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, LayoutDashboard } from "lucide-react";
import { LogoutButton } from "./logout-button";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

export const AvatarDropdown = () => {
	const { user } = useAuth();
	const isAdmin = user?.role !== "ALUMNI";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
					<Avatar className="h-8 w-8">
						<AvatarImage src={user?.avatar || ""} alt="@johndoe" />
						<AvatarFallback>
							{user?.firstName[0]}
							{user?.lastName[0]}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{user?.firstName} {user?.lastName}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user?.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuItem asChild>
					<Link href={isAdmin ? "/admin/profile" : "/profile"}>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</Link>
				</DropdownMenuItem>

				{isAdmin && (
					<DropdownMenuItem asChild>
						<Link href="/admin">
							<LayoutDashboard className="mr-2 h-4 w-4" />
							<span>Dashboard</span>
						</Link>
					</DropdownMenuItem>
				)}
				<DropdownMenuItem>
					<Bell className="mr-2 h-4 w-4" />
					<span>Notifications</span>
				</DropdownMenuItem>

				<DropdownMenuItem>
					<Settings className="mr-2 h-4 w-4" />
					<span>Settings</span>
				</DropdownMenuItem>

				<DropdownMenuSeparator />
				<LogoutButton />
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
