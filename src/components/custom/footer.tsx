"use client";
import {
	IconBrandFacebookFilled,
	IconBrandInstagram,
	IconBrandLinkedinFilled,
	IconBrandTwitterFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { publicRoutes } from "@/constant";
import { usePathname } from "next/navigation";

export const Footer = ({ show = false }: { show?: boolean }) => {
	const path = usePathname();

	return publicRoutes.includes(path) || show ? (
		<footer id="about-us" className="bg-[#313131] py-14">
			<div className="container space-y-4 mx-auto py-5">
				<div className="grid mb-14 grid-cols-2 px-5 sm:px-0 sm:grid-cols-2 md:grid-cols-4 gap-5">
					<div className="flex justify-center items-start">
						<Link href="/" className="mr-6  flex items-center space-x-2">
							<Image src="/icon.svg" height={100} width={100} alt="LNHS Logo" />
						</Link>
					</div>
					<div className="space-y-3  ">
						<h3 className="text-white font-semibold">Strand</h3>
						<ul className="  flex flex-col gap-3">
							<Link href="#">
								<li className="text-white text-xs">STEM</li>
							</Link>
							<Link href="#">
								<li className="text-white text-xs">ABM</li>
							</Link>
							<Link href="#">
								<li className="text-white text-xs">HUMSS</li>
							</Link>
							<Link href="#">
								<li className="text-white text-xs">TVL</li>
							</Link>
							<Link href="#">
								<li className="text-white text-xs">A&D</li>
							</Link>
						</ul>
					</div>
					<div className="space-y-3">
						<h3 className="text-white font-semibold">Resources</h3>
						<ul className="  flex flex-col gap-3">
							<Link href="#">
								<li className="text-white text-xs">Smart Classes</li>
							</Link>
							<Link href="#">
								<li className="text-white text-xs">Library</li>
							</Link>
							<Link href="#">
								<li className="text-white text-xs">Sports</li>
							</Link>
							<Link href="#">
								<li className="text-white text-xs">Auditorium and Halls</li>
							</Link>
						</ul>
					</div>

					<div className="space-y-3">
						<h3 className="text-white font-semibold">About Us</h3>
						<ul className="  flex flex-col gap-3">
							<Link href="#">
								<li className="text-white text-xs">Contact</li>
							</Link>
							<Link href="#">
								<li className="text-white text-xs">Help/Support</li>
							</Link>
							<Link href="#">
								<li className="text-white text-xs">FAQ</li>
							</Link>
							<Link href="#">
								<li className="text-white text-xs">Terms and Conditions</li>
							</Link>
						</ul>
					</div>
				</div>
				<Separator className="" />
				<div className="flex flex-col px-5 md:px-0 justify-center md:flex-row  gap-2 items-center md:justify-between">
					<div className="flex gap-5">
						<p className="text-white">&copy; 2025 LNHS</p>
						<Link className="text-white underline text-sm" href="#">
							Privacy Policy
						</Link>
						<Link className="text-white underline text-sm" href="#">
							Terms of Service
						</Link>
					</div>

					<div className="flex gap-5">
						<Link href="#">
							<IconBrandFacebookFilled size={24} color="#fff" />
						</Link>
						<Link href="#">
							<IconBrandInstagram size={24} color="#fff" />
						</Link>
						<Link href="#">
							<IconBrandTwitterFilled size={24} color="#fff" />
						</Link>
						<Link href="#">
							<IconBrandLinkedinFilled size={24} color="#fff" />
						</Link>
					</div>
				</div>
			</div>
		</footer>
	) : null;
};
