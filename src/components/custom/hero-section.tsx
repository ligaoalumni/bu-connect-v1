"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "@/contexts";

export function HeroSection() {
  const { user } = useAuth();
  return (
    <section className="px-5 md:px-0">
      <div className="container    mx-auto min-h-[500px] h-full md:min-h-[664px] relative">
        <Image
          alt="BUP Hero Image"
          className="absolute z-10 "
          src="/images/bup-hero-img.png"
          fill
          objectFit="cover"
        />
        <div className="absolute space-y-5 px-5 z-20 h-full w-full  flex flex-col justify-center left-0 bg-[#15497A85]">
          <h1 className="font-bold   max text-white text-2xl md:text-6xl text-left max-w-[90dvw] md:max-w-[40dvw]  ">
            Strengthening Alumni Ties Through Seamless Digital Engagement
          </h1>
          <p className="text-white text-lg md:text-xl max-w-[80dvw] md:max-w-[30dvw]  ">
            Connect with fellow BU Polangui alumni, share memories, and be
            updated on news and events
          </p>
          {user === null && (
            <div className="flex items-center gap-4">
              <Button asChild className="bg-[#E6750C] hover:bg-[#E6750C90]">
                <Link href="/register">Register</Link>
              </Button>
              <Button asChild className="bg-white text-black">
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          )}
          {/*<div className="flex items-center gap-2">
						<Button
							className="rounded-full bg-white hover:bg-white/80 "
							size="icon">
							<IconBrandFacebook className="stroke-[#E6750C] " />
						</Button>
						<Button
							className="rounded-full bg-white hover:bg-white/80 "
							size="icon">
							<IconBrandGoogle className="stroke-[#E6750C] " />
						</Button>
						<Button
							className="rounded-full bg-white hover:bg-white/80 "
							size="icon">
							<IconBrandLinkedin className="stroke-[#E6750C] " />
						</Button>
					</div>*/}
        </div>
      </div>
    </section>
  );
}
