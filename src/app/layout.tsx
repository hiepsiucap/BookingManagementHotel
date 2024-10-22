/** @format */

// src/app/layout.tsx
import "./globals.css";
import { Roboto } from "@next/font/google";
import { ReactNode } from "react";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Providers from "./Provider";
const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-Roboto",
});

export const metadata = {
  title: "My Hotel Booking App",
  description: "Best place to book your stay!",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
