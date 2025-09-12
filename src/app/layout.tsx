import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Poppins,
  Roboto,
  Tangerine,
} from "next/font/google";
import "./globals.css";
import Providers from "../providers";
import { Header } from "@/components";
import { getInformation, readSettingsAction } from "@/actions";
import MaintenancePage from "./maintenance/page";

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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "300"],
});

const tangerine = Tangerine({
  variable: "--font-tangerine",
  subsets: ["latin"],
  weight: "400",
  style: "normal",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | BU Connect",
    default: "BU Connect",
  },
  icons: { icon: "/images/bup-logo.png" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getInformation();
  const settings = await readSettingsAction();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`bg-[#F2F6FB] ${inter.variable} ${roboto.variable} ${geistSans.variable} ${poppins.variable} ${tangerine.variable} ${geistMono.variable} antialiased `}
      >
        <Providers>
          {settings &&
          settings.isMaintenance &&
          user &&
          user.role === "ALUMNI" ? (
            <MaintenancePage />
          ) : (
            <>
              {user && <Header user={user} />}
              {children}
              {/* <Footer /> */}
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}
