import { WIPBanner } from "@/components";
import { Metadata } from "next";

// either Static metadata
export const metadata: Metadata = {
	title: "LNHS | Alumni Tracking",
};

export default function Home() {
	return (
		<div className="flex  items-center justify-center h-screen">
			<WIPBanner />
		</div>
	);
}
