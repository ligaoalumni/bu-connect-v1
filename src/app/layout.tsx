import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "../providers";
import { Header } from "@/components";
import { getInformation, readSettingsAction } from "@/actions";
import MaintenancePage from "./maintenance/page";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" suppressHydrationWarning className={poppins.className}>
      <body className={`bg-[#F2F6FB] ${poppins.className}  antialiased `}>
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
