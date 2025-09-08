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
      <header className="  mx-auto bg-transparent dark:bg-transparent container px-5 md:px-0 py-5 flex items-center justify-between">
        <div className="flex items-center  gap-3">
          <Image
            src="/images/bup-logo.png"
            height={70}
            width={70}
            alt="BUP Logo"
          />
          <div>
            <h1 className="text-lg font-bold font-poppins">BU Connect</h1>
            <p className="text-lg font-poppins">Polangui</p>
          </div>
        </div>

        <div className="flex gap-2">
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
      <div
        className={`sticky top-0 ${
          path !== "/" && "shadow-md"
        }  z-50 hidden md:flex py-2 bg-[#15497A]  mx-auto container justify-center gap-4`}
      >
        {links.map((link, index) => (
          <Button
            key={`${link}-${index}`}
            variant="link"
            asChild
            className="text-white text-lg capitalize"
          >
            <Link href={link}>{link === "/" ? "Home" : link.slice(1)}</Link>
          </Button>
        ))}
      </div>
    </>
  );
}
