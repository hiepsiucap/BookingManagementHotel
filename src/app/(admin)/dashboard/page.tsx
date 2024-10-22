/** @format */
"use client";
import { formatPrice } from "@/func/Format";
import GetBooking from "@/action/GetBooking";
import GetRecentBooking from "@/action/GetRecentBooking";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import { MdOutlineBedroomChild } from "react-icons/md";
import { FaMoneyCheck } from "react-icons/fa";
import GetDashBoard from "@/action/GetDashBoard";
import { useEffect, useState } from "react";
type data = {
  totalbooking: number | null;
  totalroom: number | null;
  availableroom: number | null;
};
type Booking = {
  key: number;
  user_name: string;
  hotel: string;
  room: string;
  status: string;
  total_price: string;
};
const DashBoard = () => {
  const columns = [
    {
      key: "user_name",
      label: "Tên khách hàng",
    },
    {
      key: "hotel",
      label: "Khách sạn",
    },
    {
      key: "room",
      label: "Tên phòng",
    },
    {
      key: "status",
      label: "Trạng thái",
    },
    {
      key: "total_price",
      label: "Tổng tiền",
    },
  ];

  const [data, changedata] = useState<data>();
  const [bookinglist, changebookinglist] = useState<Booking[] | undefined>();
  useEffect(() => {
    const GetData = async () => {
      const data = await GetDashBoard();
      const booking = await GetRecentBooking();

      if (data.success) {
        changedata(data?.data);
      }
      if (booking.success) {
        const filterbooking = booking?.data?.map((booking) => {
          return {
            key: booking.id,
            user_name: booking.user_name,
            hotel: booking?.room_type.hotel.name,
            room: booking?.room_type.description,
            status:
              booking?.status === "Confirmed"
                ? "Đã xác nhận"
                : booking?.status === "check_in"
                ? "Đã nhận phòng"
                : booking?.status === "check_out"
                ? "Đã trả phòng"
                : booking?.status === "cancelled"
                ? "Đã huỷ"
                : "Đang xác nhận",
            total_price: formatPrice(booking.total_price),
          };
        });
        changebookinglist(filterbooking);
      }
      console.log(data, booking);
    };
    GetData();
  }, []);
  return (
    <section className=" m-6">
      <h5 className=" text-2xl  ">Tổng quan</h5>
      <div className="flex  my-6 mx-auto space-x-6">
        <div className=" rounded-2xl shadow-lg bg-green-500 bg-opacity-10 w-1/3 py-8 px-8">
          <p className=" text-sm text-gray-500">Tổng doanh thu:</p>
          <div className=" flex items-center py-2 space-x-3">
            <FaMoneyCheck size={36} color="green" />
            <h2 className=" text-2xl font-medium">
              {data?.totalbooking && formatPrice(data?.totalbooking)}
            </h2>
          </div>
        </div>
        <div className=" rounded-2xl shadow-lg bg-green-500 bg-opacity-10 w-1/3 py-8 px-8">
          <p className=" text-sm text-gray-500">tổng số phòng :</p>
          <div className=" flex items-center py-2 space-x-3">
            <MdOutlineBedroomChild size={36} color="green" />
            <h2 className=" text-2xl font-medium">{data?.totalroom}</h2>
          </div>
        </div>
        <div className=" rounded-2xl shadow-lg bg-green-500 bg-opacity-10 w-1/3 py-8 px-8">
          <p className=" text-sm text-gray-500">Số phòng trống:</p>
          <div className=" flex items-center py-2 space-x-3">
            <MdOutlineBedroomChild size={36} color="green" />
            <h2 className=" text-2xl font-medium">{data?.availableroom}</h2>
          </div>
        </div>
      </div>
      {bookinglist && bookinglist?.length > 0 && (
        <>
          <h3 className=" text-lg">Đơn đặt phòng gần đây:</h3>
          <Table aria-label="Example table with dynamic content">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={bookinglist}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => (
                    <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      )}
    </section>
  );
};
export default DashBoard;
