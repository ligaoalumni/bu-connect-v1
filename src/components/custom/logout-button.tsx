"use client";
import { logout } from "@/actions/auth";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LogoutButton() {
	const router = useRouter();
	return (
		<DropdownMenuItem
			onClick={async () => {
				try {
					await logout();

					router.replace("/");
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
