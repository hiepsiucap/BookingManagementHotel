/** @format */
"use client";
import { Select, SelectItem } from "@nextui-org/react";
import { generateTimeSlots, generatePastTimeSlots } from "@/func/Generate";
const CustomSelect = ({
  startHour,
  ChangeStartHour,
  UpdateModal,
  selectedDate,
  TypeRent,
}: {
  startHour: string;
  UpdateModal: any;
  ChangeStartHour: any;
  selectedDate: any;
  TypeRent: string;
}) => {
  const handleOpenChange = (open: any) => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const handleClick = (event: any) => {
    event.stopPropagation();
  };
  const time = generateTimeSlots() || [];
  const now = new Date();
  let isDisable =
    now.getMonth() == selectedDate?.month - 1 &&
    selectedDate?.day == now.getDate()
      ? true
      : false;
  console.log(now.getHours());
  console.log(isDisable);
  const pastime = generatePastTimeSlots() || [];
  console.log(startHour);
  return (
    <Select
      label="Giờ nhận"
      placeholder="Chọn giờ nhận "
      disabledKeys={(isDisable && pastime) || []}
      className="  max-w-xs w-1/2"
      selectedKeys={[startHour]}
      onChange={(e) => {
        console.log(e.target.value);

        ChangeStartHour((prev: any) => {
          return {
            ...prev,
            [TypeRent]: e.target.value,
          };
        });
        UpdateModal(true);
      }}
    >
      {time.map((t) => (
        <SelectItem key={t.timenumb}>{t.timeString}</SelectItem>
      ))}
      {/* <SelectItem key={"00:30"}>{"00:30"}</SelectItem> */}
    </Select>
  );
};
export default CustomSelect;
