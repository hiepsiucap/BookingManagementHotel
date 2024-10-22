/** @format */

"use client";
import { useEffect, useState } from "react";
import { FindRoomByHotel } from "@/action/GetRoomByHotel";
import { fetchHotelList } from "@/action/GetHotel";
import { Select, SelectItem } from "@nextui-org/select";
import { Hotel, RoomTypes } from "@prisma/client";
import { button, Button } from "@nextui-org/react";
import { formatDateToCustomStringDay } from "@/func/Format";
import ModalBookSelect from "@/components/ModalBookSelect";
interface ReturnRoom {
  name: string;
  id: number;
  status: string;
  maxtime: Date;
  bookingid: Number | null;
}
import BookingCaledar from "@/components/ModalBook";
import ModalCheckBox from "@/components/ModalCheckOut";
const CheckRoom = () => {
  const [listhotel, changelisthotel] = useState<Hotel[]>([]);
  const [selecthotel, changeselecthotel] = useState<String>("");
  const [listroom, changelistroom] = useState<ReturnRoom[] | undefined>([]);
  useEffect(() => {
    const GetRoom = async () => {
      const room = await FindRoomByHotel(Number(selecthotel));
      changelistroom(room);
      console.log(room);
    };
    if (selecthotel) GetRoom();
  }, [selecthotel]);
  useEffect(() => {
    const fetchhotel = async () => {
      const hotels = await fetchHotelList();
      changelisthotel(hotels);
      if (hotels.length > 0) {
        changeselecthotel(hotels[0]?.id.toString());
      }
    };
    fetchhotel();
  }, []);
  return (
    <section className="px-12">
      <div className=" flex justify-between w-full py-6">
        <h5 className=" text-2xl">Kiểm tra phòng</h5>
        <div className="w-1/4">
          {listhotel?.length > 0 && (
            <Select
              onChange={(e) => {
                changeselecthotel(e.target.value);
              }}
              className=" w-full"
            >
              {/* <SelectItem key={""}></SelectItem> */}
              {listhotel.map((hotel) => {
                return <SelectItem key={hotel.id}>{hotel.name}</SelectItem>;
              })}
            </Select>
          )}
        </div>
      </div>
      <div className=" grid  grid-cols-3 grid-rows-4 gap-4">
        {listroom?.map((room) => {
          return (
            <div
              key={room.id}
              className={
                room.status == "red"
                  ? "bg-red-400 p-6 py-6 rounded-xl text-center font-semibold text-lg"
                  : room.status == "green"
                  ? "bg-green-500 p-6 py-6 rounded-xl text-center font-semibold text-lg"
                  : "bg-yellow-400 p-6 py-6 rounded-xl text-center font-semibold text-lg"
              }
            >
              <p>{room.name}</p>
              {room.status !== "green" ? (
                <p className=" font-sans text-sm">Giờ rảnh phòng:</p>
              ) : (
                <p className=" font-sans text-sm">Giờ trả phòng:</p>
              )}

              <p className=" font-light text-sm">
                {room.maxtime > new Date()
                  ? formatDateToCustomStringDay(room.maxtime)
                  : room.status == "red"
                  ? "Phòng đang dọn dẹp"
                  : "Phòng không vướng lịch"}
              </p>
              <div className=" flex space-y-2 my-4 flex-col">
                <ModalBookSelect
                  MaxTime={room.maxtime}
                  roomId={room.id.toString()}
                ></ModalBookSelect>
                <ModalCheckBox bookingid={room.bookingid}></ModalCheckBox>
                <BookingCaledar roomId={room.id.toString()}></BookingCaledar>
              </div>
            </div>
          );
          <button className=" b"></button>;
        })}
      </div>
    </section>
  );
};
export default CheckRoom;
