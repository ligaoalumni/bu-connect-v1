"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { publicRoutes } from "@/constant";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts";
import { User } from "@prisma/client";
import { ThemeSwitcher } from "./theme-switcher";
import { AvatarDropdown } from "./avatar-dropdown";
import { MobileDrawer } from "./mobile-header";
import { NotificationDropdown } from "./notification-dropdown";

const links = [
  "/",
  "/memories",
  "/events",
  "/jobs",
  "/announcements",
  "/highlights",
];

const showMainNavRoutes = publicRoutes.concat(["/verify-account", "/"]);

export function Header({
  user,
}: {
  user: Pick<
    User,
    "firstName" | "lastName" | "email" | "role" | "id" | "avatar" | "batch"
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

  return (
    showMainNavRoutes.includes(path) && (
      <>
        <header className="  mx-auto bg-[#15497A] container px-5 md:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center  gap-3">
            <Image
              src="/images/bup-logo.png"
              height={70}
              width={70}
              alt="BUP Logo"
            />
            <div className="!-space-y-4">
              <h1 className="!leading-none text-lg font-bold font-poppins text-[#FFA629]">
                BU Connect
                <br />
                Polangui
              </h1>
            </div>
          </div>
          <div className="flex gap-2 items-center bg-[#15497A]">
            <div className={`  z-50 hidden md:flex py-2  gap-2 `}>
              {links.map((link, index) => (
                <Button
                  key={`${link}-${index}`}
                  variant="link"
                  asChild
                  className={`  text-lg capitalize ${path == link ? "text-[#FF7903] font-bold" : "text-white"}`}
                >
                  <Link href={link}>
                    {link === "/" ? "Home" : link.slice(1)}
                  </Link>
                </Button>
              ))}
            </div>
            <ThemeSwitcher />
            {user ? (
              <>
                <NotificationDropdown />
                <AvatarDropdown />
              </>
            ) : (
              <Button
                variant="default"
                asChild
                className="text-white text-lg capitalize"
              >
                <Link href="/login">Login</Link>
              </Button>
            )}
            <div className="md:hidden block">
              <MobileDrawer />
            </div>
          </div>
        </header>
      </>
    )
  );
}
