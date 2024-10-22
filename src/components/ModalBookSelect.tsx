/** @format */

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import CustomSelectDay from "./SelectDay";
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
import Swal from "sweetalert2/dist/sweetalert2.js";
import { AdminCreateBooking } from "@/action/AdminCreateBooking";
import { calculateHoursBetweenDates } from "@/func/Format";
export default function ModalBookSelect({
  roomId,
  MaxTime,
}: {
  roomId: string;
  MaxTime: Date;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [typerent, changeTyperent] = useState("");
  const [Numb, updateNumb] = useState("1000");
  const [NumbDay, updateNumbDay] = useState("1");
  const [hi, UpdateModal] = useState(false);
  useEffect(() => {
    console.log(MaxTime);
    const numsday = calculateHoursBetweenDates(MaxTime, new Date());
    updateNumb(Numb);
  }, [MaxTime]);
  console.log(Numb);
  const onSubmit = async () => {
    const formdata = new FormData();
    const date = new Date();
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
    const returnString = checkout_date[getPriceKey(typerent)]?.toISOString();
    const startdate = new Date().toISOString();
    const check_out_time = formdata.set("check_out_time", returnString);
    const start_date_time = formdata.set("start_date_time", startdate);
    const startHour = formdata.set(
      "startHour",
      new Date().getHours().toString()
    );

    const numbDay = formdata.set("numbDay", NumbDay);
    const roomTypesId = formdata.set("room_type_id", roomId);
    const numbHour = formdata.set("numbHour", Numb === "1" ? "1000" : Numb);
    const TypeRent = formdata.set("TypeRent", typerent);
    const response = await AdminCreateBooking(formdata);
    console.log(response);
    if (response.success) {
      Swal.fire({
        icon: "success",
        title: "Đặt phòng thành công",
      }).then(() => {
        window.location.reload();
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Đặt phòng không thành công",
        text: "Hệ thống đang gặp lỗi",
      }).then(() => {
        window.location.reload();
      });
    }
  };
  return (
    <>
      <Button
        className=" font-semibold bg-white"
        onPress={onOpen}
      >
        Đặt phòng
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Đặt phòng
              </ModalHeader>
              <ModalBody>
                <Select
                  onChange={(e) => {
                    changeTyperent(e.target.value);
                  }}
                  label="Chọn kiểu thuê"
                >
                  <SelectItem key={"priceHour"}>Theo giờ</SelectItem>
                  <SelectItem key={"priceNight"}>Qua đêm</SelectItem>
                  <SelectItem key={"priceDay"}>Theo ngày </SelectItem>
                </Select>
                {typerent == "priceDay" && (
                  <CustomSelectDay
                    NumbDay={NumbDay}
                    updateNumbDay={updateNumbDay}
                    UpdateModal={UpdateModal}
                  ></CustomSelectDay>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={onSubmit}
                >
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
