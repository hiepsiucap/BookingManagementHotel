/** @format */
"use client";
import { Roboto } from "@next/font/google";
import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MdOutlineRoomService, MdRoom, MdWifi } from "react-icons/md";
import { FaCalendar } from "react-icons/fa";
import { FaHotel, FaPlus } from "react-icons/fa";
import { button } from "@nextui-org/theme";
import CheckIcon from "@mui/icons-material/Check";
import { FiDollarSign } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { GrOverview } from "react-icons/gr";
interface RootLayoutProps {
  children: ReactNode;
}

export default function AdminLayOut({ children }: RootLayoutProps) {
  const { data: session, status } = useSession();
  const router = usePathname();
  console.log(router);
  console.log(session?.user);
  return (
    <section>
      <div className=" w-full bg-white">
        <div className="flex  font-sans justify-between items-center md:container mx-auto ">
          <Link
            href={"/"}
            className=" flex items-center"
          >
            <Image
              src="https://res.cloudinary.com/dhhuv7n0h/image/upload/v1723450908/logo-footer-5187_1_oesws2.png"
              alt=""
              width={80}
              height={80}
            />
          </Link>
          {status === "authenticated" && session && (
            <div className=" flex space-x-4 items-center ">
              <Image
                src={session?.user?.image || ""}
                alt=""
                width={120}
                height={120}
                className=" w-14 h-14 rounded-full border-2"
              />
              <p>{session?.user?.name}</p>
            </div>
          )}
        </div>
      </div>
      <section className=" w-full  px-8 py-4">
        <div className=" flex  items-start space-y-2 w-full pt-4">
          <div className=" pt-6 flex flex-col w-1/5">
            <h1 className=" text-green-400 font-bold text-xl py-2">
              {" "}
              Danh mục
            </h1>
            <Link
              className=" flex justify-start items-center space-x-1  border-t-2  border-green-400 px-4 py-4"
              href={"/dashboard"}
            >
              <GrOverview
                color={router == "/dashboard" ? "green" : "black"}
                size={32}
              />
              <p
                className={
                  router == "/dashboard" ? "text-green-500 font-bold" : ""
                }
              >
                Tổng quan
              </p>
            </Link>
            <Link
              className=" flex justify-start items-center space-x-1  border-t-2  border-green-400 px-4 py-4"
              href={"/dashboard/createhotel"}
            >
              <FaHotel
                color={router == "/dashboard/createhotel" ? "green" : "black"}
                size={32}
              />
              <p
                className={
                  router == "/dashboard/createhotel"
                    ? "text-green-500 font-bold"
                    : ""
                }
              >
                Tạo khách sạn
              </p>
            </Link>
            <Link
              className=" flex justify-start items-center space-x-1  border-t-2  border-green-400 px-4 py-4"
              href={"/dashboard/checkbooking"}
            >
              <FaCheck
                color={router == "/dashboard/checkbooking" ? "green" : "black"}
                size={32}
              />
              <p
                className={
                  router == "/dashboard/checkbooking"
                    ? "text-green-500 font-bold"
                    : ""
                }
              >
                Kiểm tra đơn đặt
              </p>
            </Link>
            <Link
              className=" flex justify-start items-center space-x-1  border-t-2  border-green-400 px-4 py-4"
              href={"/dashboard/checkroom"}
            >
              <FaCalendar
                color={router == "/checkroom" ? "green" : "black"}
                size={32}
              />
              <p
                className={
                  router == "/dashboard/checkroom"
                    ? "text-green-500 font-bold"
                    : ""
                }
              >
                Phòng trống
              </p>
            </Link>
            <Link
              className=" flex justify-start items-center space-x-1  border-t-2  border-green-400 px-4 py-4"
              href={"/dashboard/createroom"}
            >
              <MdRoom
                color={router == "/dashboard/createroom" ? "green" : "black"}
                size={32}
              />
              <p
                className={
                  router == "/dashboard/createroom"
                    ? "text-green-500 font-bold"
                    : ""
                }
              >
                Tạo phòng
              </p>
            </Link>{" "}
            <Link
              className=" flex justify-start items-center space-x-1  border-t-2  border-green-400 px-4 py-4"
              href={"/dashboard/createamenity"}
            >
              <MdWifi
                color={router == "/dashboard/createamenity" ? "green" : "black"}
                size={32}
              />
              <p
                className={
                  router == "/dashboard/createamenity"
                    ? "text-green-500 font-bold"
                    : ""
                }
              >
                Tạo tính năng
              </p>
            </Link>{" "}
            <Link
              className=" flex justify-start items-center space-x-1  border-t-2  border-green-400 px-4 py-4"
              href={"/dashboard/addamenity"}
            >
              <FaPlus
                color={router == "/dashboard/addamenity" ? "green" : "black"}
                size={32}
              />
              <p
                className={
                  router == "/dashboard/addamenity"
                    ? "text-green-500 font-bold"
                    : ""
                }
              >
                Thêm tiện ích
              </p>
            </Link>
            <Link
              className=" flex justify-start items-center space-x-1  border-t-2  border-green-400 px-4 py-4"
              href={"/dashboard/createprice"}
            >
              <FiDollarSign
                color={router == "/dashboard/createprice" ? "green" : "black"}
                size={32}
              />
              <p
                className={
                  router == "/dashboard/createprice"
                    ? "text-green-500 font-bold"
                    : ""
                }
              >
                Cập nhật giá
              </p>
            </Link>
          </div>
          <div className="w-full">{children}</div>
        </div>
      </section>
    </section>
  );
}
