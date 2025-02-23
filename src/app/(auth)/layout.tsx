import React from "react";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main>
			<section className="hidden md:block"></section>
			<section className="p-4 min-h-screen flex justify-center items-center w-full">
				{children}
			</section>
		</main>
	);
}
