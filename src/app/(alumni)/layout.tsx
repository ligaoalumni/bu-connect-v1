import React from "react";
import { Header } from "./__components";

export default function AlumniLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col bg-[#EAF4FD] overflow-hidden max-h-[100dvh] dark:bg-[#1A2B40]">
			<Header />
			<main className="px-5 scrollbar-hide md:px-3 lg:px-0 container min-h-[calc(100dvh-6rem)] overflow-y-auto mx-auto py-5">
				{children}
			</main>
		</div>
	);
}
