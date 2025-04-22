import React from "react";
import { Iconify } from "./iconify";
import Link from "next/link";

const about = [
	{
		link: "/login",
		icon: "teenyicons:user-square-solid",
		title: "Alumni Registration/Login",
		description:
			"Sign up using your student id or login with your social media account.",
	},
	{
		link: "/#",
		icon: "mdi:users",
		title: "Alumni Directory",
		description: "Search and connect with fellow alumni.",
	},
	{
		link: "/events",
		icon: "mdi:events",
		title: "News & Events",
		description: "Stay informed and updated on university activities.",
	},
	{
		link: "/#",
		icon: "material-symbols:work",
		title: "Job Opportunities",
		description: "Find and apply for jobs and internships available to alumni.",
	},
	{
		link: "/#",
		icon: "fluent:guest-16-filled",
		title: "Guest Speaker",
		description: "Seeking inspiring speakers for the graduation ceremony.",
	},
	{
		link: "/#",
		icon: "mdi:achievement",
		title: "Achievements",
		description:
			"Showcasing alumni success stories, awards, and professional milestones.",
	},
];

export function About() {
	return (
		<section className="px-5 md:px-0">
			<div className="container mx-auto py-20">
				<div>
					<h1 className="text-[#043265] text-2xl md:text-6xl font-bold">
						About BUConnect
					</h1>
					<p className="text-[#043265] text-lg md:text-xl md:leading-loose">
						BUConnect Polangui is a digital platform designed to foster strong
						connections among BU Polangui alumni. Our mission is to provide a
						seamless way for alumni to engage, share, and collaborate. BUConnect
						is a platform designed to connect students, alumni, faculty, and
						staff of the university. It offers a space for communication,
						collaboration, and easy access to university resources and updates.
						Whether you&apos;re looking to network, stay informed, or find
						academic and career opportunities, BUConnect helps keep everyone
						engaged and connected.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2   md:gap-y-20  py-10 gap-5 mt-10 lg:grid-cols-3">
					{about.map((item, index) => (
						<AboutCard key={`${item.title}-${index}`} {...item} />
					))}
				</div>
			</div>
		</section>
	);
}

const AboutCard = ({
	icon,
	description,
	title,
	link,
}: {
	icon: string;
	title: string;
	description: string;
	link: string;
}) => {
	return (
		<Link
			href={link}
			className="bg-white max-w-[299px] mx-auto rounded-lg  p-2">
			<Iconify
				icon={icon}
				width={106}
				height={106}
				className="mx-auto mb-5"
				style={{ color: "#E8770B" }}
			/>
			<h2 className="text-xl font-semibold text-center">{title}</h2>
			<p className="text-gray-600 mt-2 text-center">{description}</p>
		</Link>
	);
};
