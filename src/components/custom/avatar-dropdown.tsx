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
import { Settings, User, LayoutDashboard, Files } from "lucide-react";
import { LogoutButton } from "./logout-button";
import Link from "next/link";
import { useAuth } from "@/contexts";

export const AvatarDropdown = () => {
  const { user } = useAuth();
  const isAdmin = user?.role !== "ALUMNI";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative bg-white/80  w-9 h-9    rounded-full"
        >
          <Avatar className="h-9 w-9">
            {user?.avatar ? (
              <AvatarImage src={user.avatar} alt="Avatar" />
            ) : (
              <AvatarFallback>
                {user?.firstName[0]}
                {user?.lastName[0]}
              </AvatarFallback>
            )}
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
              {user?.email && user.email.length > 25
                ? `${user.email.substring(0, 25)}...`
                : user?.email}
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

        <DropdownMenuItem asChild>
          <Link href={isAdmin ? "/my-posts" : "/profile"}>
            <Files className="mr-2 h-4 w-4" />
            <span>My Posts</span>
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
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href={"/admin/settings"}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
