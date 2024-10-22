/** @format */

// src/app/layout.tsx
import { Roboto } from "@next/font/google";
import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

interface RootLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: RootLayoutProps) {
  return (
    <section>
      <div className=" w-full bg-white">
        <div className="flex  font-sans justify-between items-center md:container mx-auto ">
          <Link href={"/"} className=" flex items-center">
            <Image
              src="https://res.cloudinary.com/dhhuv7n0h/image/upload/v1723450908/logo-footer-5187_1_oesws2.png"
              alt=""
              width={80}
              height={80}
            />
          </Link>
          <div className=" flex space-x-4 items-center ">
            <button className=" border-2 border-green-500 p-1 px-2 w-28 text-green-600 rounded-xl">
              Giới thiệu
            </button>
            <button className=" border-2 border-green-500 p-1 px-2 w-28 text-green-600  rounded-xl">
              Liên hệ
            </button>
            <Image
              src="https://res.cloudinary.com/dhhuv7n0h/image/upload/v1723451377/facebook_vs5z5f.png"
              alt=""
              width={50}
              height={50}
              className=" w-8 h-8"
            />
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}
