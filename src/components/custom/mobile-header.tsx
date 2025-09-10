"use client";

import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Socials,
} from "@/components";
import { Iconify } from "./iconify";
import Image from "next/image";
import Link from "next/link";

const links = [
  "/",
  "/batch",
  "/events",
  "/jobs",
  "/announcements",
  "/highlights",
];

export function MobileDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-[#FFA629AA] bg-transparent"
          size="icon"
        >
          <Iconify
            icon="line-md:menu-fold-left"
            width="24"
            height="24"
            style={{ color: "#FFF" }}
          />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center gap-3">
            <Image
              src="/images/bup-logo.png"
              height={70}
              width={70}
              alt="BUP Logo"
            />
            <div className="flex flex-col items-start">
              <SheetTitle className="text-lg font-bold font-poppins">
                BU Connect
              </SheetTitle>
              <SheetDescription className="text-lg font-poppins">
                Polangui
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="flex flex-col gap-3 items-start mt-5">
          {links.map((link, index) => (
            <SheetClose asChild key={`sheet-btn-${link}-${index}`}>
              <Button
                key={`${link}-${index}`}
                variant="link"
                asChild
                className="text-lg capitalize"
              >
                <Link href={link}>{link === "/" ? "Home" : link.slice(1)}</Link>
              </Button>
            </SheetClose>
          ))}
        </div>

        <div className="absolute bottom-0 w-full flex flex-col gap-3 items-center p-5">
          <Socials />
        </div>
      </SheetContent>
    </Sheet>
  );
}
