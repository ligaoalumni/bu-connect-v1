"use client";
import React from "react";
import { ThemeProvider } from "./theme-provider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<>
			<NextTopLoader showSpinner={false} speed={1000} />
			<ThemeProvider
				attribute="class"
				defaultTheme="light"
				enableSystem
				disableTransitionOnChange>
				{children}
				<Toaster />
			</ThemeProvider>
		</>
	);
}
