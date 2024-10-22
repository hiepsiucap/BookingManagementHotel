/** @format */
"use client";
import DatePickers from "./DatePicker";
import EachRoom from "./EachRoom";
import CustomSelect from "./Select";
import { Button } from "@nextui-org/react";
import { CameraIcon } from "@/assets/CameraIcon";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";
import CustomSelectHour from "./SelectHour";
import NavigateBack from "@/assets/NavigateBack";
import CustomSelectDay from "./SelectDay";
import { DatePicker } from "@nextui-org/react";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useRouter } from "next/navigation";
import "sweetalert2/src/sweetalert2.scss";
import { now, today, getLocalTimeZone } from "@internationalized/date";
import { CreditCardOutlined, QrcodeOutlined } from "@ant-design/icons";
import { RadioGroup, Radio } from "@nextui-org/react";
import { CheckAvaRoom } from "@/action/CheckAvaRoom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Gallery from "./Gallery";
import {
  formatDateToCustomString,
  formatDateToCustomStringDay,
  formatPrice,
} from "@/func/Format";
import { CreateABooking } from "@/action/CreateABooking";
interface ImageType {
  original: string;
  thumbnail: string;
}
type CheckInOutType = {
  priceDay: Date;
  priceHour: Date;
  priceNight: Date;
};

const BookingSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .min(10, "Phone Number must at be at least 10 digits"),
  user_name: z.string().min(1, "Name is required"),
  special_request: z.string(),
  paymentMethod: z.enum(["cash", "qr-code"], {
    errorMap: () => ({ message: "You must select a payment method" }),
  }),
});
const getCurrentHour = () => {
  const date = new Date();

  const minus = date.getMinutes();
  let hour = date.getHours();
  if (minus < 30) hour = hour + 0.5;
  else hour = hour + 1;
  return hour.toString();
};
const getPriceKey = (typeRental: string) => {
  switch (typeRental) {
    case "priceDay":
      return "priceDay";
    case "priceNight":
      return "priceNight";
    case "priceHour":
      return "priceHour";
    default:
      throw new Error(`Invalid type_rental: ${typeRental}`);
  }
};
const TypePayment = (typepayment: string) => {
  switch (typepayment) {
    case "qr-code":
      return "qr-code";
    case "cash":
      return "cash";
    default:
      throw new Error(`Invalid type_payment: ${typepayment}`);
  }
};
interface ReturnListRoom {
  images: ImageType[];
  id: number;
  name: string;
  utilities: string[];
  price: {
    priceDay: number;
    priceNight: number;
    priceHour: number;
  };
}
interface ReturnPrice {
  id: number;
  isAvai: boolean;
  price: number;
}
type BookingInput = z.infer<typeof BookingSchema>;
const ChooseRoom = ({
  listroom,
  name,
  id,
  checkin,
  checkout,
}: {
  listroom: ReturnListRoom[];
  name: string;
  id: string;
  checkin: CheckInOutType;
  checkout: CheckInOutType;
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(BookingSchema),
  });
  const onClickHandler = () => {
    Swal.fire({
      icon: "success",
      title: "Đặt phòng thành công",
      text: "Nhân viên chúng tôi sẽ gọi điện để xác nhận",
    }).then(() => {});
  };

  const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));
  const UpdateTypeHandler = async () => {
    const hours = parseFloat(startHour[getPriceKey(TypeRent)]);
    const fullHours = Math.floor(hours);
    const minutes = (hours - fullHours) * 60;
    console.log(selectedDate.day);
    const date = new Date(
      selectedDate.year,
      selectedDate.month - 1,
      selectedDate.day,
      fullHours,
      minutes
    );
    let returndate = new Date();
    const checkout_date = {
      priceDay: new Date(date),
      priceHour: new Date(date),
      priceNight: new Date(date),
    };

    checkout_date.priceHour.setHours(date.getHours() + Number(Numb));
    if (date.getHours() > 22 || date.getHours() < 6) {
      if (date.getHours() < 6) {
        checkout_date.priceNight.setHours(12);
      } else {
        checkout_date.priceNight.setDate(date.getDate() + 1);
        checkout_date.priceNight.setHours(12);
        checkout_date.priceNight.setSeconds(0);
        checkout_date.priceNight.setMinutes(0);
      }
    } else {
      checkout_date.priceNight.setDate(date.getDate() + 1);
      checkout_date.priceNight.setHours(12);
      checkout_date.priceNight.setSeconds(0);
      checkout_date.priceNight.setMinutes(0);
    }
    if (date.getHours() > 16 && date.getHours() < 22) {
    } else if (date.getHours() < 14) {
    }
    checkout_date.priceDay.setDate(date.getDate() + 1);
    checkout_date.priceDay.setHours(12);
    checkout_date.priceDay.setSeconds(0);
    checkout_date.priceDay.setMinutes(0);
    const dateString = date?.toISOString();
    const returnString = checkout_date[getPriceKey(TypeRent)]?.toISOString();
    console.log(dateString, returnString);
    const formdata = new FormData();
    formdata.set("Date", dateString);
    formdata.set("returnDate", returnString);
    formdata.set("startHour", startHour[getPriceKey(TypeRent)]);
    formdata.set("numbDay", NumbDay);
    formdata.set("numbHour", Numb);
    formdata.set("id", id);
    formdata.set("TypeRent", TypeRent);
    console.log("Hello");
    const response = await CheckAvaRoom(formdata);
    UpdateModal(false);
    updatecheckoutdate((prev) => {
      return {
        ...prev,
        [getPriceKey(TypeRent)]: response?.checkout_date,
      };
    });
    updatelistroom((prev) => {
      return prev.map((room, index) => {
        return {
          ...room,
          price: {
            ...room.price,
            [getPriceKey(TypeRent)]: response?.listprice[index].price,
          },
        };
      });
    });
  };
  const [Numb, updateNumb] = useState("2");
  const [NumbDay, updateNumbDay] = useState("1");
  const [booking, updatebooking] = useState<any>(null);
  const [checkoutdate, updatecheckoutdate] = useState<{
    priceDay: Date;
    priceNight: Date;
    priceHour: Date;
  }>({
    priceDay: checkout?.priceDay || new Date(),
    priceNight: checkout?.priceNight || new Date(),
    priceHour: checkout?.priceHour || new Date(),
  });
  const [TypeRent, UpdateTypeRent] = useState("priceHour");
  const [listrooms, updatelistroom] = useState<ReturnListRoom[]>(listroom);
  const [Modal, UpdateModal] = useState(false);
  const [startHour, ChangeStartHour] = useState({
    priceDay:
      (
        checkin.priceDay.getHours() +
        (checkin.priceDay.getMinutes() >= 30 ? 0.5 : 0)
      ).toString() || "",
    priceHour:
      (
        checkin.priceHour.getHours() +
        (checkin.priceHour.getMinutes() >= 30 ? 0.5 : 0)
      ).toString() || "",
    priceNight:
      (
        checkin.priceNight.getHours() +
        (checkin.priceNight.getMinutes() >= 30 ? 0.5 : 0)
      ).toString() || "",
  });
  const [chooseRoom, UpdateChooseRoom] = useState<ReturnListRoom | null>(null);
  console.log();
  console.log(chooseRoom);
  const OnClickUpdateTypeRent = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.id) {
      UpdateTypeRent(e.currentTarget.id);
      UpdateModal(false);
    }
  };
  const onChooseRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    UpdateChooseRoom(
      listrooms.find((lr) => lr.id === Number(e.currentTarget.id)) || null
    );
  };
  const onSubmitHandler = async (data: BookingInput) => {
    const hours = parseFloat(startHour[getPriceKey(TypeRent)]);
    const fullHours = Math.floor(hours);
    const minutes = (hours - fullHours) * 60;
    console.log(selectedDate.day);
    const date = new Date(
      selectedDate.year,
      selectedDate.month - 1,
      selectedDate.day,
      fullHours,
      minutes
    );
    let returndate = new Date();
    const start_date_time = date?.toISOString();
    const check_out_time = checkoutdate[getPriceKey(TypeRent)].toISOString();
    const formdata = new FormData();
    formdata.set("start_date_time", start_date_time);
    formdata.set("check_out_time", check_out_time);
    formdata.set("startHour", startHour[getPriceKey(TypeRent)]);
    formdata.set("numbDay", NumbDay);
    formdata.set("numbHour", Numb);

    formdata.set(
      "total_price",
      chooseRoom?.price[getPriceKey(TypeRent)].toString() || ""
    );
    formdata.set("TypeRent", TypeRent);
    formdata.set("phone_number", data.phone_number);
    formdata.set("user_name", data.user_name);
    formdata.set("email", data.email);
    formdata.set("special_request", data.special_request);
    formdata.set("paymentMethod", data.paymentMethod);
    if (chooseRoom?.id) formdata.set("room_type_id", chooseRoom?.id.toString());
    else throw new Error("Failed to Success");
    const response = await CreateABooking(formdata);
    if (response?.success) {
      Swal.fire({
        icon: "success",
        title: "Đặt phòng thành công",
        text: "Nhân viên chúng tôi sẽ gọi điện để xác nhận",
      }).then(() => {
        updatebooking(response?.booking);
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Đặt phòng thất bại ",
        text: response?.message,
      }).then(() => {
        if (response.reset) router.push("/");
      });
    }
  };
  const onErrorHandler = (error: any) => {
    console.log("Form Errors:", error);
    // Handle form validation errors here
  };
  return (
    <div>
      {!booking ? (
        <div>
          {!chooseRoom ? (
            <>
              {" "}
              <div className=" flex flex-col space-y-2">
                <h5 className=" font-bold text-green-500 text-lg">
                  Chọn phòng
                </h5>
                <div className=" flex w-full space-x-2">
                  <button
                    id="priceHour"
                    onClick={OnClickUpdateTypeRent}
                    className={
                      TypeRent == "priceHour"
                        ? "w-1/3 bg-green-600 text-white rounded-2xl flex justify-center items-center space-x-1 py-1"
                        : "w-1/3 bg-white text-green-600 hover:bg-green-600 hover:bg-opacity-50 hover:text-white rounded-2xl flex justify-center items-center space-x-1 py-1"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <div>Theo giờ</div>
                  </button>
                  <button
                    id="priceNight"
                    onClick={OnClickUpdateTypeRent}
                    className={
                      TypeRent == "priceNight"
                        ? "w-1/3 bg-green-600 text-white rounded-2xl flex justify-center items-center space-x-1 py-1"
                        : "w-1/3 bg-white text-green-600 hover:bg-green-600 hover:bg-opacity-50 hover:text-white rounded-2xl flex justify-center items-center space-x-1 py-1"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                      />
                    </svg>

                    <div>Qua đêm</div>
                  </button>
                  <button
                    id="priceDay"
                    onClick={OnClickUpdateTypeRent}
                    className={
                      TypeRent == "priceDay"
                        ? "w-1/3 bg-green-600 text-white rounded-2xl flex justify-center items-center space-x-1 py-1"
                        : "w-1/3 bg-white text-green-600 hover:bg-green-600 hover:bg-opacity-50 hover:text-white rounded-2xl flex justify-center items-center space-x-1 py-1"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className=" w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                      />
                    </svg>

                    <div>Theo ngày</div>
                  </button>
                </div>
                <div className=" font-bold ">Nhận phòng</div>
                <div className=" flex justify-between w-full">
                  <div className=" w-1/2 flex space-x-2">
                    <DatePickers
                      setSelectedDate={setSelectedDate}
                      selectedDate={selectedDate}
                      UpdateModal={UpdateModal}
                    ></DatePickers>
                    <CustomSelect
                      selectedDate={selectedDate}
                      startHour={startHour[getPriceKey(TypeRent)]}
                      TypeRent={TypeRent}
                      ChangeStartHour={ChangeStartHour}
                      UpdateModal={UpdateModal}
                    ></CustomSelect>
                  </div>
                  <div className=" w-2/3 flex justify-end items-center space-x-2">
                    {TypeRent == "priceHour" && (
                      <CustomSelectHour
                        Numb={Numb}
                        updateNumb={updateNumb}
                        UpdateModal={UpdateModal}
                      ></CustomSelectHour>
                    )}
                    {TypeRent == "priceNight" && (
                      <div className="w-1/2 max-w-xl flex flex-row gap-4">
                        <DatePicker
                          isDisabled={true}
                          label="Ngày trả "
                          variant="bordered"
                          hideTimeZone
                          onChange={() => {
                            UpdateModal(true);
                          }}
                          showMonthAndYearPickers
                        />
                      </div>
                    )}
                    {TypeRent == "priceDay" && (
                      <CustomSelectDay
                        NumbDay={NumbDay}
                        updateNumbDay={updateNumbDay}
                        UpdateModal={UpdateModal}
                      ></CustomSelectDay>
                    )}
                    <Button
                      color="success"
                      onClick={UpdateTypeHandler}
                      className=" text-white py-7"
                      endContent={<CameraIcon />}
                    >
                      Tìm phòng
                    </Button>
                  </div>
                </div>
                {checkoutdate[getPriceKey(TypeRent)] && (
                  <div className="text-sm text-gray-600">
                    Trả phòng:{" "}
                    {formatDateToCustomString(
                      checkoutdate[getPriceKey(TypeRent)]
                    )}
                  </div>
                )}
              </div>
              <div className=" relative grid grid-cols-2 mt-4 ">
                {Modal && (
                  <div className="w-full h-full z-10 absolute bg-black opacity-70 text-center text-slate-200">
                    <div className=" pt-10">
                      Nhấn tìm phòng để cập nhật kết quả{" "}
                    </div>
                  </div>
                )}
                {listrooms.map((lr, index) => {
                  return (
                    <EachRoom
                      images={lr.images}
                      name={lr.name}
                      price={lr.price[getPriceKey(TypeRent)]}
                      utilities={lr.utilities}
                      UpdateChooseRoom={onChooseRoom}
                      key={lr.id}
                      id={Number(lr.id)}
                    ></EachRoom>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <form
                onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}
                className=" flex flex-col p-2 space-y-4  "
              >
                <button
                  onClick={() => {
                    UpdateChooseRoom(null);
                  }}
                  className=" hover:scale-105 flex space-x-2 text-green-600"
                >
                  <NavigateBack size={5}></NavigateBack>
                  <p className=" font-medium text-green-600">{name}</p>
                </button>
                <div className=" flex space-x-5 w-full items-center">
                  <div className="flex flex-col p-4 py-6 border rounded-xl w-1/2">
                    <Gallery images={chooseRoom?.images || []}></Gallery>
                    <div className="flex flex-col space-y-1">
                      <h5 className=" font-bold text-2xl pb-1 pt-2">
                        {chooseRoom?.name}
                      </h5>
                      {chooseRoom?.utilities.map((utility) => {
                        return (
                          <p
                            key={utility}
                            className=" text-gray-800 font-extralight"
                          >
                            - {utility}
                          </p>
                        );
                      })}
                    </div>
                  </div>

                  <div className=" w-1/2 rounded-xl  bg-primary space-y-4 py-8 px-6 bg-opacity-15">
                    <h5 className=" text-lg font-bold pb-2">
                      Nhập thông tin đặt phòng của bạn
                    </h5>
                    <Input
                      type="email"
                      id="email"
                      {...register("email", { required: "email is required" })}
                      isInvalid={!!errors.email}
                      errorMessage={errors.email?.message}
                      label="Email"
                    />
                    <Input
                      type="text"
                      id="phone_number"
                      {...register("phone_number")}
                      isInvalid={!!errors.phone_number}
                      errorMessage={errors.phone_number?.message}
                      label="Số điện thoại"
                    />
                    <Input
                      type="text"
                      id="user_name"
                      {...register("user_name")}
                      isInvalid={!!errors.user_name}
                      errorMessage={errors.user_name?.message}
                      label="Họ và Tên"
                    />
                    <Input
                      type="textarea"
                      id="specialRequest"
                      label="Yêu cầu đặt biệt"
                      {...register("special_request")}
                      isInvalid={!!errors.special_request}
                      errorMessage={errors.special_request?.message}
                    ></Input>
                  </div>
                </div>
                <div className=" w-full space-y-4 py-4 px-4 border rounded-xl">
                  <h5 className=" text-medium text-green-600">
                    Bạn có thể thanh toán trước
                  </h5>
                  <RadioGroup
                    {...register("paymentMethod")}
                    onChange={(e) =>
                      setValue("paymentMethod", TypePayment(e.target.value))
                    }
                  >
                    <Radio value="cash">
                      <CreditCardOutlined style={{ marginRight: "8px" }} />
                      Thanh toán khi nhận phòng
                    </Radio>
                    <Radio value="qr-code">
                      <QrcodeOutlined style={{ marginRight: "8px" }} />
                      Quét mã QR trên ứng dụng ngân hàng
                    </Radio>
                  </RadioGroup>
                </div>
                <div className=" relative overflow-hidden w-full space-y-3 py-4 px-4 pb-20 border rounded-xl">
                  <h5 className="  text-lg font-bold text-green-600">
                    Chi tiết đặt phòng của bạn
                  </h5>
                  <div className=" flex space-x-1">
                    <div className=" font-thin">Nhận phòng:</div>
                    <div className=" font-bold">
                      {formatDateToCustomStringDay(
                        new Date(
                          selectedDate.year,
                          selectedDate.month - 1,
                          selectedDate.day,
                          Number(startHour[getPriceKey(TypeRent)]),
                          (Number(startHour[getPriceKey(TypeRent)]) -
                            Math.floor(
                              Number(startHour[getPriceKey(TypeRent)])
                            )) *
                            60
                        )
                      )}
                    </div>
                  </div>
                  <div className=" flex space-x-1">
                    <div className=" font-thin">Trả phòng:</div>
                    <div className=" font-bold">
                      {formatDateToCustomStringDay(
                        checkoutdate[getPriceKey(TypeRent)]
                      )}
                    </div>
                  </div>
                  <div className=" flex space-x-1">
                    <div className=" font-thin">Tổng thời gian lưu trú:</div>
                    <div className=" font-bold">
                      {TypeRent === "priceDay"
                        ? `${NumbDay} ngày`
                        : TypeRent === "priceHour"
                        ? `${Numb} giờ`
                        : "1 đêm"}{" "}
                    </div>
                  </div>
                  <div className=" flex space-x-1">
                    <div className=" font-thin">Phòng: {chooseRoom.name} :</div>
                    <div className=" font-bold">
                      {formatPrice(chooseRoom.price[getPriceKey(TypeRent)])}
                    </div>
                  </div>
                  <div className="absolute bottom-0 py-3 left-0 items-center px-4 bg-green-600 bg-opacity-15  w-full flex justify-between">
                    <div>
                      <div className=" text-lg font-medium ">Giá</div>
                      <div className=" text-sm text-gray-500">
                        {"(Đã bao gồm thuế, phí)"}
                      </div>
                    </div>
                    <div className="  font-bold text-xl">
                      {formatPrice(chooseRoom.price[getPriceKey(TypeRent)])}
                    </div>
                  </div>
                </div>
                <Button
                  // onClick={onClickHandler}
                  type="submit"
                  isDisabled={isSubmitting}
                  className=" w-full bg-green-600 text-white font-bold text-base "
                >
                  Xác nhận đặt phòng
                </Button>
              </form>
            </>
          )}
        </div>
      ) : (
        <div className=" m-2">
          <button
            onClick={() => {
              UpdateChooseRoom(null);
            }}
            className=" hover:scale-105 flex space-x-2 text-green-600"
          >
            <NavigateBack size={5}></NavigateBack>
            <p className=" font-medium text-green-600">{name}</p>
          </button>
          <div className=" mx-2 my-6 bg-green-400 bg-opacity-30 rounded-2xl p-6 flex items-center justify-between">
            <div className=" flex flex-col space-y-2">
              <h5 className=" text-xl font-bold text-green-900">
                Đặt phòng thành công
              </h5>
              <p className=" font-extralight text-green-700">
                Cảm ơn bạn đã đặt phòng tại Lá Hotel
              </p>
            </div>
            <div className=" flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="green"
                className=" w-16"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                />
              </svg>
            </div>
          </div>
          <div className=" mt-6 mx-2 border border-gray-600 rounded-md p-6 flex justify-between items-center ">
            <div>
              <div className=" text-xl font-bold">Thông tin đặt phòng</div>
              <div className=" flex space-x-1 mt-2">
                <p className=" text-thin text-gray-600">Mã đặt phòng :</p>
                <p className=" font-bold">#{booking?.id}</p>
              </div>
              <div className=" flex space-x-1 mt-2">
                <p className=" text-thin text-gray-600">Nhận phòng :</p>
                <p className=" font-bold">
                  {formatDateToCustomStringDay(booking?.start_date_time)}
                </p>
              </div>
              <div className=" flex space-x-1 mt-2">
                <p className=" text-thin text-gray-600">Trả phòng :</p>
                <p className=" font-bold">
                  {formatDateToCustomStringDay(booking?.check_out_time)}
                </p>
              </div>
              <div className=" flex space-x-1 mt-2">
                <p className=" text-thin text-gray-600">Tên khách sạn :</p>
                <p className=" font-bold">{name}</p>
              </div>
              <div className=" flex space-x-1 mt-2">
                <p className=" text-thin text-gray-600">Tên khách sạn :</p>
                <p className=" font-bold">{name}</p>
              </div>
              <div className=" flex space-x-1 mt-2">
                <p className=" text-thin text-gray-600">Tổng tiền :</p>
                <p className=" font-bold">
                  {formatPrice(booking?.total_price)}
                </p>
              </div>
              <div className=" flex space-x-1 mt-2">
                <p className=" text-thin text-gray-600">Thanh toán:</p>
                <p className=" text-red-500 font-bold"> Chưa thanh toán </p>
              </div>

              <div className=" border w-full my-3"></div>
              <div className=" flex space-x-1 mt-2">
                <p className=" text-thin text-gray-600">Số điện thoại :</p>
                <p className=" font-bold">{booking?.phone_number}</p>
              </div>
              <div className=" flex space-x-1 mt-2">
                <p className=" text-thin text-gray-600">Tên khách hàng :</p>
                <p className=" font-bold">{booking?.user_name}</p>
              </div>
              <div className=" flex space-x-1 mt-2">
                <p className=" text-thin text-gray-600">Yêu cầu đặc biệt :</p>
                <p className=" font-bold">{booking?.special_request}</p>
              </div>
            </div>
            <div className=" w-2/5 rounded-lg">
              <Gallery images={chooseRoom?.images || []}></Gallery>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChooseRoom;
