import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Tangerine } from "next/font/google";
import "./globals.css";
import Providers from "../providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const tangerine = Tangerine({
	variable: "--font-tangerine",
	subsets: ["latin"],
	weight: "400",
	style: "normal",
});

export const metadata: Metadata = {
	title: {
		template: "%s | LNHS Alumni Tracking",
		default: "LNHS Alumni Tracking",
	},
	icons: { icon: "/icon.svg" },
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${poppins.variable} ${tangerine.variable} ${geistMono.variable} antialiased `}>
				<Providers>
					{/* <MainNav user={userInfo} /> */}
					{children}
					{/* <Footer /> */}
				</Providers>
			</body>
		</html>
	);
}
