import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";
import { FluidCursor } from "@/components/effects/FluidCursor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OmegaTech Configurator",
  description: "Build Your PC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-zinc-950 text-zinc-50`}
      >
        <Providers>
          {/* Ambient Background Layer */}
          <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
            {/* Dark base */}
            <div className="absolute inset-0 bg-zinc-950"></div>

            {/* Radial Gradient Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]"></div>
            <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-cyan-500/5 blur-[100px]"></div>

            <FluidCursor />
          </div>

          <Navbar />
          <main className="flex-grow flex flex-col z-0 relative">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
