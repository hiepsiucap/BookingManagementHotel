/** @format */
"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { useEffect, useState } from "react";
import { Booking } from "@prisma/client";
import GetBookingByRoom from "@/action/GetBookingByRoom";
import { Tab } from "@mui/material";
import { formatDateToCustomString, formatPrice } from "@/func/Format";
export default function BookingCaledar({ roomId }: { roomId: string }) {
  const [listbooking, changelistbooking] = useState<Booking[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const onClickHandler = async () => {
    const formdata = new FormData();
    formdata.set("room_id", roomId);
    const data = await GetBookingByRoom(formdata);
    if (data) {
      changelistbooking(data);
    }
  };
  console.log(listbooking);
  return (
    <>
      <Button
        className="bg-white font-semibold"
        onPress={onOpen}
        onClick={onClickHandler}
      >
        Lịch đặt phòng
      </Button>
      <Modal
        isOpen={isOpen}
        size="4xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Danh sách đặt phòng
              </ModalHeader>
              <ModalBody>
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>Ngày nhận phòng</TableColumn>
                    <TableColumn>Ngày trả phòng</TableColumn>
                    <TableColumn>Tên khách hàng</TableColumn>
                    <TableColumn>Số điện thoại</TableColumn>
                    <TableColumn>Tổng tiền</TableColumn>
                    <TableColumn>Trạng thái</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {listbooking &&
                      listbooking.map((booking) => {
                        return (
                          <TableRow key={booking.id}>
                            <TableCell>
                              {formatDateToCustomString(
                                booking.start_date_time
                              )}
                            </TableCell>
                            <TableCell>
                              {" "}
                              {formatDateToCustomString(
                                booking.check_out_time || new Date()
                              )}
                            </TableCell>
                            <TableCell> {booking.user_name}</TableCell>
                            <TableCell> {booking.phone_number}</TableCell>
                            <TableCell>
                              {formatPrice(booking.total_price)}
                            </TableCell>
                            <TableCell>
                              {booking.status === "Confirmed"
                                ? "Đã xác nhận"
                                : booking.status === "check_in"
                                ? "Đã nhận phòng"
                                : booking.status === "cancelled"
                                ? "Đã huỷ"
                                : "Đã trả phòng"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onClose}
                >
                  Kết thúc
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
