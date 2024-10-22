/** @format */
"use client";
import Checkout from "@/action/CheckOut";
import UpdateBooking from "@/action/UpdateBooking";
import { useRouter } from "next/router";
import { formatDateToCustomStringDay, formatPrice } from "@/func/Format";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Booking } from "@prisma/client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";
export default function ModalCheckBox({
  bookingid,
}: {
  bookingid: Number | null;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [datacheckout, updatedata] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchcheckout = async () => {
      const formdata = new FormData();
      formdata.set("booking_id", bookingid?.toString() || "");
      const data: any = await Checkout(formdata);
      if (data.success) {
        updatedata(data.data);
      }
    };
    if (bookingid) fetchcheckout();
  }, [bookingid]);
  const onSubmit = async () => {
    if (datacheckout) {
      const response = await UpdateBooking(datacheckout);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Đặt phòng thành công",
          text: "Nhân viên chúng tôi sẽ gọi điện để xác nhận",
        }).then(() => {
          window.location.reload();
        });
      }
    }
  };
  return (
    <>
      <Button
        className=" bg-white font-semibold"
        onPress={onOpen}
      >
        Check out
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Trả phòng
              </ModalHeader>
              <ModalBody>
                <div>
                  <div className=" text-xl font-bold">Thông tin đặt phòng</div>
                  <div className=" flex space-x-1 mt-2">
                    <p className=" text-thin text-gray-600">Mã đặt phòng :</p>
                    <p className=" font-bold">#{datacheckout?.id}</p>
                  </div>
                  <div className=" flex space-x-1 mt-2">
                    <p className=" text-thin text-gray-600">Nhận phòng :</p>
                    <p className=" font-bold">
                      {formatDateToCustomStringDay(
                        datacheckout?.start_date_time || new Date()
                      )}
                    </p>
                  </div>
                  <div className=" flex space-x-1 mt-2">
                    <p className=" text-thin text-gray-600">Trả phòng :</p>
                    <p className=" font-bold">
                      {formatDateToCustomStringDay(
                        datacheckout?.check_out_time || new Date()
                      )}
                    </p>
                  </div>

                  <div className=" flex space-x-1 mt-2">
                    <p className=" text-thin text-gray-600">Tổng tiền :</p>
                    <p className=" font-bold">
                      {formatPrice(datacheckout?.total_price || 0)}
                    </p>
                  </div>
                  <div className=" flex space-x-1 mt-2">
                    <p className=" text-thin text-gray-600">Thanh toán:</p>
                    <p className=" text-red-500 font-bold"> Chưa thanh toán </p>
                  </div>

                  <div className=" border w-full my-3"></div>
                  <div className=" flex space-x-1 mt-2">
                    <p className=" text-thin text-gray-600">Số điện thoại :</p>
                    <p className=" font-bold">{datacheckout?.phone_number}</p>
                  </div>
                  <div className=" flex space-x-1 mt-2">
                    <p className=" text-thin text-gray-600">Tên khách hàng :</p>
                    <p className=" font-bold">{datacheckout?.user_name}</p>
                  </div>
                  <div className=" flex space-x-1 mt-2">
                    <p className=" text-thin text-gray-600">
                      Yêu cầu đặc biệt :
                    </p>
                    <p className=" font-bold">
                      {datacheckout?.special_request}
                    </p>
                  </div>
                </div>
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
