import { Cedarville_Cursive, Geist, Geist_Mono } from "next/font/google";

export const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

export const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const cedarvilleCursive = Cedarville_Cursive({
	variable: "--font-cedarville-cursive",
	subsets: ["latin"],
	weight: "400",
	style: "normal",
});
