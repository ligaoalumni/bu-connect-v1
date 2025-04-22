import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export function Header() {
	return (
		<div className="">
			<header className="mx-auto container px-5 md:px-0 py-5 flex items-center justify-between">
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

				<Button asChild>
					<Link href="/login">Log in</Link>
				</Button>
			</header>
		</div>
	);
}
