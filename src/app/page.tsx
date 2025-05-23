import { readBatchesAction } from "@/actions";
import {
	About,
	AspectRatio,
	BackToTopButton,
	Button,
	ContactSectionForm,
	Footer,
	HeroSection,
} from "@/components";
import { welcomeImageBlurData } from "@/constant";
import { Metadata } from "next";
import Image from "next/image";

// either Static metadata
export const metadata: Metadata = {
	title: "BU Connect",
};

// const FCalendar = lazy(() => import("@/components/custom/full-calendar"));

export default async function Home() {
	return (
		<>
			<HeroSection />
			<About />

			<Footer />
		</>
	);

	return (
		<div className=" ">
			{/* HERO SECTION */}
			<section
				id="#home"
				className="min-h-screen min-w-screen items-center	bg-center  bg-[url('/images/hero-img.png')] bg-no-repeat bg-cover relative">
				{/* <header className="z-50 absolute top-5 lef-0 w-full px-5">
					<div className="container mx-auto flex items-center justify-end h-full">
						<Button asChild>
							<Link href="/login">Log in</Link>
						</Button>
					</div>
				</header> */}
				<div className="h-full w-full absolute top-0 left-0 z-10 bg-black/45 " />
				<div className="px-5 md:px-0 absolute w-full top-[50%] z-20 -translate-y-[50%]">
					<div className="container mx-auto space-y-5">
						<h1 className="text-white text-3xl md:text-6xl font-extrabold">
							Ligao National
							<br />
							High School Alumni
							<br />
							Community
						</h1>
						<div>
							<p className="text-white">
								Keeping connection between old and young
							</p>
							<p className="text-[#D2D2D2]">
								The school that loves and nurtures the human spirit
							</p>
						</div>
						<div className="flex gap-4">
							<Button className="rounded-[5px]">Join Us</Button>
							<a href="#welcome">
								<Button
									className="rounded-[5px] bg-transparent border-white text-white"
									variant="outline">
									Learn More
								</Button>
							</a>
						</div>
					</div>
				</div>
			</section>
			{/* HERO SECTION */}

			{/* Welcome Section */}
			<section
				id="welcome"
				className=" min-h-screen min-w-screen flex items-center bg-[#EAF4FD]">
				<div className="container px-5 gap-0 md:gap-5 py-5 mx-auto flex md:flex-row flex-col-reverse items-center">
					<div className="w-full space-y-5">
						<h2 className="text-2xl md:text-5xl font-semibold">
							Welcome to
							<br /> Ligao National High School
						</h2>
						<p className="text-wrap md:text-lg md:max-w-[90%] ">
							Ligao National High School (LNHS) is a public high school in Ligao
							City, Albay, Philippines, recognized for its commitment to quality
							education and school-based management best practices, with a
							mission to provide varied curricula and a technologically-equipped
							learning environment.
						</p>
						<p className="text-wrap md:text-lg md:max-w-[90%]">
							Ligao National High School takes pride in its strong and dynamic
							alumni network, composed of graduates who have excelled in various
							fields and made meaningful contributions to society. As former
							students of this esteemed institution, alumni carry with them the
							values of excellence, integrity, and service instilled during
							their time at LNHS.
						</p>
						<p className="text-wrap md:text-lg md:max-w-[90%]">
							The school remains a home for its graduates, fostering connections
							through reunions, outreach programs, and professional networking
							opportunities. Alumni are encouraged to give back to their alma
							mater by mentoring students, supporting school initiatives, and
							participating in activities that strengthen the bond between past
							and present generations. With a legacy built on academic
							achievement and community involvement, Ligao National High School
							continues to celebrate the success of its alumni, recognizing
							their role in upholding the school&apos;s tradition of excellence
							and inspiring future learners.
						</p>

						<Button className="rounded-[5px]">Join Us</Button>
					</div>
					<div className="w-full py-10 flex items-center justify-center">
						<AspectRatio className="relative" ratio={16 / 11}>
							<Image
								blurDataURL={welcomeImageBlurData}
								fill
								className="rounded-[3rem]"
								src="/images/welcome-img.png"
								alt="Welcome Image"
							/>
						</AspectRatio>
					</div>
				</div>
			</section>
			{/* Welcome Section */}

			{/* Batch */}

			{/* Contact Us Section */}
			<ContactSectionForm />

			<BackToTopButton />
		</div>
	);
}
