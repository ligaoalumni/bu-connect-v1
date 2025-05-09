import { Marquee } from "@/components";
import Image from "next/image";
import React from "react";

const defaultImages = [
	{ image: "/images/event-img-1.png", alt: "event image 1" },
	{ image: "/images/event-img-2.png", alt: "event image 2" },
	{ image: "/images/event-img-3.png", alt: "event image 3" },
	{ image: "/images/event-img-4.png", alt: "event image 4" },
];

export default function ImagesMarquee({
	images = defaultImages,
}: {
	images?: { image: string; alt: string }[];
}) {
	return (
		<div>
			<section className=" ">
				<Marquee pauseOnHover className="">
					{images.map((image, index) => (
						<EventImageCard key={index} image={image.image} alt={image.alt} />
					))}
				</Marquee>
			</section>
		</div>
	);
}

const EventImageCard = ({ image, alt }: { image: string; alt?: string }) => {
	return (
		<div className="relative mx-5 min-w-[240px] max-w-[240px] md:max-w-[300px] md:min-w-[300px] h-[280px] md:h-[320px] ">
			<Image alt={alt || image} fill src={image} />
		</div>
	);
};
