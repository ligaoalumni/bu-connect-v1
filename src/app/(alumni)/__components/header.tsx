"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts";
import {
  ThemeSwitcher,
  AvatarDropdown,
  Button,
  MobileDrawer,
  NotificationDropdown,
} from "@/components";
import { usePathname } from "next/navigation";

const links = [
  "/",
  "/batch",
  "/events",
  "/jobs",
  "/announcements",
  "/highlights",
];

export function Header() {
  const { user } = useAuth();
  const path = usePathname();

  return (
    <>
      <header className=" bg-[#15497A] mx-auto    container px-5 md:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center  gap-3">
          <Image
            src="/images/bup-logo.png"
            height={70}
            width={70}
            alt="BUP Logo"
          />
          <div>
            <h1 className="text-lg font-bold font-poppins text-[#FFA629]">
              BU Connect
            </h1>
            <p className="text-lg font-bold font-poppins text-[#FFA629]">
              Polangui
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div className={`  z-50 hidden lg:flex py-2 bg-[#15497A] gap-2 `}>
            {links.map((link, index) => (
              <Button
                key={`${link}-${index}`}
                variant="link"
                asChild
                className={`  text-lg capitalize ${path == link ? "text-[#FFA629] font-bold" : "text-white"}`}
              >
                <Link href={link}>{link === "/" ? "Home" : link.slice(1)}</Link>
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

          <div className="lg:hidden block">
            <MobileDrawer />
          </div>
        </div>
      </header>
    </>
  );
}
