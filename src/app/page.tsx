import { getInformation } from "@/actions";
import {
  About,
  UpComingEventsAndJobs,
  NewsAndAnnouncementsSection,
  Feed,
} from "@/components";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import LoadingUI from "@/components/custom/global-loading-ui";

// either Static metadata
export const metadata: Metadata = {
  title: "BU Connect",
};

const HeroSection = dynamic(
  () =>
    import("@/components/custom/hero-section").then((mod) => mod.HeroSection),
  {
    loading: LoadingUI,
  },
);

const Footer = dynamic(() => import("@/components").then((mod) => mod.Footer), {
  loading: LoadingUI,
});

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
