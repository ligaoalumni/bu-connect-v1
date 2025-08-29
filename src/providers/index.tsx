"use client";
import React from "react";
import { ThemeProvider } from "./theme-provider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components";
import { AuthProvider, ContentProvider } from "@/contexts";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
      >
        <AuthProvider>
          <ContentProvider>
            <NextTopLoader showSpinner={false} speed={1000} />
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </ContentProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </>
  );
}
