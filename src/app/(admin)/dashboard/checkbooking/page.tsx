/** @format */
"use client";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/react";
import { Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";
import GetBooking from "@/action/GetBooking";
import { formatDateToCustomStringDay, formatPrice } from "@/func/Format";
import Swal from "sweetalert2";
import UpdateStatusBooking from "@/action/UpdateStatusBooking";
import { number } from "zod";

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Optional: 'auto' for instant scroll
  });
};
const CheckBooking = () => {
  const [status, updatestatus] = useState("pending");
  const [listbooking, updatebooking] = useState<Booking[]>([]);
  const [page, currentpage] = useState<number>(1);
  const [pagelist, updatepagelist] = useState<Booking[]>([]);
  useEffect(() => {
    updatepagelist(listbooking.slice(page * 5 - 5, page * 5));
  }, [page, listbooking]);
  console.log(page);
  type Booking = {
    id: number;
    phone_number: string;
    user_name: string;
    special_request: string | null;
    total_price: number;
    start_date_time: Date | null;
    status: string;
    is_paid: boolean;
    payment_method: string;
    room_type_id: number;
    room_type?: any | null;
    check_out_time: Date | null;
    rental_price_id: number;
  };
  const constFormatBooking = (status: any) => {
    switch (status) {
      case "pending":
        return "Đang xác nhận";
      case "cancelled":
        return "Đã huỷ";
      case "Confirmed":
        return "Đã xác nhận";
      case "check_out":
        return "Đã trả phòng";
      case "check_in":
        return "Đã trả phòng";
    }
  };
  const colorstatus = (status: any) => {
    switch (status) {
      case "pending":
        return "font-bold text-2xl text-yellow-500 pb-2";
      case "cancelled":
        return "font-bold text-2xl text-red-500 pb-2";
      case "Confirmed":
        return "font-bold text-2xl text-green-500 pb-2";
      case "check_out":
        return "font-bold text-2xl text-cian-500 pb-2";
      case "check_in":
        return "font-bold text-2xl text-orange-500 pb-2";
      default:
        "";
    }
  };
  const onClickHandler = async (e: any) => {
    console.log(e.target.id);
    console.log(e.target.name);
    const formdata = new FormData();
    formdata.set("booking_id", e.target.name);
    formdata.set("status", e.target.id);
    const response = await UpdateStatusBooking(formdata);
    if (response?.success) {
      updatebooking((prev) => {
        return prev.filter((booking: any) => {
          if (booking?.id == e.target.name) return false;
          return true;
        });
      });
      Swal.fire("Cập nhật thành công", response.message, "success");
    } else {
      Swal.fire("Cập nhật thất bại", response?.message, "error");
    }
  };
  useEffect(() => {
    const UpdateBooking = async () => {
      const formdata = new FormData();
      if (status) formdata.set("status", status);
      const response = await GetBooking(formdata);
      if (response.success) {
        console.log(response.data);
        updatebooking(response?.data || []);
      } else {
        Swal.fire(
          "Lấy dữ liệu thật bại",
          "Vui lòng kiểm tra lại kết nối mạng",
          "error"
        );
      }
    };
    UpdateBooking();
  }, [status]);
  return (
    <section className=" mx-12 w-full">
      <div className=" flex items-center ">
        <h4 className=" text-2xl min-w-64">Danh sách đơn hàng</h4>
        <div className=" w-full flex justify-end">
          <Select
            label="Loại đơn hàng"
            placeholder="Chọn trạng thái"
            className="  max-w-xs w-1/4 mr-6"
            selectedKeys={[status]}
            onChange={(e) => {
              updatestatus(e.target.value);
            }}
          >
            <SelectItem key={"pending"}>Đang xác nhận </SelectItem>
            <SelectItem key={"cancelled"}>Đã huỷ phòng </SelectItem>
            <SelectItem key={"check_in"}>Đã nhận phòng</SelectItem>
            <SelectItem key={"Confirmed"}>Đã xác nhận</SelectItem>
            <SelectItem key={"check_out"}>Đã trả phòng</SelectItem>
            <SelectItem key={""}>Tất cả đơn</SelectItem>
          </Select>
        </div>
      </div>
      <div className=" flex flex-col mx-4 mt-6 space-y-4  w-11/12">
        {pagelist.map((booking) => {
          return (
            <div
              className=" p-4 border border-gray-300 rounded-2xl   flex items-center justify-between"
              key={booking.id}
            >
              <div className=" flex flex-col space-y-2 h-full justify-center ">
                <div className=" flex space-x-1">
                  <h5 className=" text-gray-600 font-thin">Mã đơn hàng</h5>
                  <p className=" font-bold">#{booking?.id}</p>
                </div>
                <div className=" flex space-x-1">
                  <h5 className=" text-gray-600 font-thin">Tên phòng:</h5>
                  <p className=" font-bold">{booking.room_type?.description}</p>
                </div>
                <div className=" flex space-x-1">
                  <h5 className=" text-gray-600 font-thin">Tên khách sạn:</h5>
                  <p className=" font-bold">{booking.room_type?.hotel.name}</p>
                </div>
                <div className=" flex space-x-1">
                  <h5 className=" text-gray-600 font-thin">
                    Thời gian nhận phòng:
                  </h5>
                  <p className=" font-bold">
                    {booking.start_date_time &&
                      formatDateToCustomStringDay(booking.start_date_time)}
                  </p>
                </div>
                <div className=" flex space-x-1">
                  <h5 className=" text-gray-600 font-thin">
                    Thời gian trả phòng:
                  </h5>
                  <p className=" font-bold">
                    {" "}
                    {booking.check_out_time &&
                      formatDateToCustomStringDay(booking.check_out_time)}
                  </p>
                </div>
              </div>
              <div className=" border-l-1 pl-4  border-gray-600 flex flex-col space-y-1 w-1/3 ">
                <div className={colorstatus(booking.status)}>
                  {constFormatBooking(booking.status)}
                </div>
                <div className=" flex space-x-1  items-end ">
                  <h5 className=" text-gray-600 font-thin pb-0.5">
                    Số điện thoại:
                  </h5>
                  <p className=" font-bold text-lg text-green-500">
                    {booking.phone_number}
                  </p>
                </div>
                <div className=" flex space-x-1">
                  <h5 className=" text-gray-600 font-thin">Tên khách hàng:</h5>
                  <p className=" font-bold">{booking.user_name}</p>
                </div>
                <div className=" flex space-x-1 items-end ">
                  <h5 className=" text-gray-600 font-thin pb-0.5">
                    số tiền thanh toán:
                  </h5>
                  <p className=" font-bold ">
                    {formatPrice(booking.total_price)}
                  </p>
                </div>
                <div className=" flex space-x-1 items-end ">
                  <h5 className=" text-gray-600 font-thin pb-0.5">
                    Tình trạng:
                  </h5>
                  <p
                    className={
                      booking.is_paid
                        ? " font-bold text-green-400 "
                        : " font-bold text-red-400"
                    }
                  >
                    {booking.is_paid ? "Đã thanh toán" : "Chưa thanh toán "}
                  </p>
                </div>
                <div className=" flex space-x-4">
                  <div>
                    <Button
                      onClick={onClickHandler}
                      name={booking.id.toString()}
                      disabled={!(booking.status == "pending")}
                      id="Confirmed"
                      className="bg-green-500 text-white mx-auto font-bold"
                    >
                      Xác nhận đơn hàng
                    </Button>
                  </div>
                  <div>
                    <Button
                      onClick={onClickHandler}
                      id="cancelled"
                      name={booking.id.toString()}
                      className="bg-green-500 ml-4 text-white mx-auto font-bold"
                    >
                      Huỷ đơn hàng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {listbooking.length > 5 && (
          <Pagination
            loop
            showControls
            page={page}
            onChange={(page: number) => {
              scrollToTop();
              currentpage(page);
            }}
            color="success"
            className=" mx-auto mt-4"
            total={
              listbooking.length % 5 == 0
                ? listbooking.length / 5
                : listbooking.length / 5 + 1
            }
            initialPage={1}
          />
        )}
      </div>
    </section>
  );
};

export default CheckBooking;
