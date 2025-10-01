import { getInformation } from "@/actions";
import {
	About,
	Feed,
	Footer,
	HeroSection,
	NewsAndAnnouncementsSection,
	UpComingEventsAndJobs,
} from "@/components";
import { Metadata } from "next";

// either Static metadata
export const metadata: Metadata = {
	title: "BU Connect",
};

export default async function Home() {
	const user = await getInformation();

	if (!user) {
		return (
			<>
				<HeroSection />
				<About />
				<NewsAndAnnouncementsSection />
				<UpComingEventsAndJobs />
				<Footer />
			</>
		);
	}

	return (
		<>
			<Feed />
			<Footer />
		</>
	);
}
