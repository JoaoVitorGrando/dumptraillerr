import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PwaRegister from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "FAGU Home Services — Dump Trailer Rental",
  description:
    "Professional dump trailer rental in Seattle, WA. Fast delivery, flexible pickup, and transparent pricing. Book online in minutes.",
  manifest: "/manifest.webmanifest",
  applicationName: "FAGU DumpTrailler",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FAGU DumpTrailler",
  },
  formatDetection: {
    telephone: false,
  },
  keywords: ["dump trailer rental", "Seattle", "junk removal", "debris hauling", "FAGU"],
  openGraph: {
    title: "FAGU Home Services — Dump Trailer Rental",
    description: "Professional dump trailer rental in Seattle, WA.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-brand-light">
        <PwaRegister />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
