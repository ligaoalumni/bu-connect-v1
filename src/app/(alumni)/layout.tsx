import React from "react";
import { Footer } from "@/components";
import { Header } from "./__components";

export default function AlumniLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col bg-[#EAF4FD] overflow-y-auto scrollbar-hide overscroll-none max-h-[100dvh] dark:bg-[#1A2B40] ">
      <Header />
      <main className="  scrollbar-hide    container min-h-[calc(100dvh-6rem)] overflow-y-auto mx-auto pb-5">
        {children}
      </main>
      <Footer />
    </div>
  );
}
