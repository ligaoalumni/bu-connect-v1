"use client";
import { logout } from "@/actions/auth";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { revalidatePathAction } from "@/actions";

export function LogoutButton() {
	return (
		<DropdownMenuItem
			onClick={async () => {
				try {
					await logout();
					revalidatePathAction("/", "/");
				} catch (error) {
					toast.error("Failed to logout", {
						description: (error as Error).message,
						position: "top-center",
						richColors: true,
						duration: 5000,
					});
				}
			}}
			className="text-red-600">
			<LogOut className="mr-2 h-4 w-4" />
			<span>Log out</span>
		</DropdownMenuItem>
	);
}
