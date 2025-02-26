import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { getInformation } from "@/actions";
import { MainNav } from "@/components";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "LNHS - ALUMNI TRACKING",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await getInformation();

	const userInfo = user?.id
		? {
				email: user.email,
				firstName: user.firstName,
				id: user.id,
				lastName: user.lastName,
				role: user.role,
		  }
		: null;

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased `}>
				<Providers>
					<MainNav user={userInfo} />
					{children}
				</Providers>
			</body>
		</html>
	);
}
