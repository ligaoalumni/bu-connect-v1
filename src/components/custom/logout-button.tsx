"use client";
import { logout } from "@/actions/auth";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { LogOut } from "lucide-react";

export function LogoutButton() {
	return (
		<DropdownMenuItem
			onClick={async () => {
				const response = await logout();
				if (response && response.error.message) {
					console.error(response.error.message);
				}
			}}
			className="text-red-600">
			<LogOut className="mr-2 h-4 w-4" />
			<span>Log out</span>
		</DropdownMenuItem>
	);
}
