import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const links = [
	"/",
	"/batch",
	"/events",
	"/jobs",
	"/announcements",
	"/highlights",
];

export function Header() {
	return (
		<>
			<header className="  mx-auto bg-white container px-5 md:px-0 py-5 flex items-center justify-between">
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

				{/* <Button asChild>
					<Link href="/login">Log in</Link>
				</Button> */}
			</header>
			<div className="sticky top-0   z-50 hidden md:flex py-2 bg-[#15497A]  shadow-md mx-auto container justify-center gap-4">
				{links.map((link, index) => (
					<Button
						key={`${link}-${index}`}
						variant="link"
						asChild
						className="text-white text-lg capitalize">
						<Link href={link}>{link === "/" ? "Home" : link.slice(1)}</Link>
					</Button>
				))}
			</div>
		</>
	);
}
