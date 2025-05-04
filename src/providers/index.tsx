"use client";
import React from "react";
import { ThemeProvider } from "./theme-provider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components";
import { AuthProvider } from "@/contexts/auth-context";
import { ContentProvider } from "@/contexts/content-context";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<>
			<AuthProvider>
				<ContentProvider>
					<NextTopLoader showSpinner={false} speed={1000} />
					<ThemeProvider
						attribute="class"
						defaultTheme="light"
						enableSystem
						disableTransitionOnChange>
						{children}
						<Toaster />
					</ThemeProvider>
				</ContentProvider>
			</AuthProvider>
		</>
	);
}
