/** @format */
"use client";
import { Select, SelectItem } from "@nextui-org/react";

const CustomSelectHour = ({
  Numb,
  updateNumb,
  UpdateModal,
}: {
  Numb: string;
  UpdateModal: any;
  updateNumb: any;
}) => {
  const hours = [];
  for (let i = 1; i <= 24; i++) {
    hours.push(i);
  }
  return (
    <Select
      label="số giờ thuê:"
      placeholder="Chọn số giờ thuê "
      disabledKeys={[1, 2]}
      selectedKeys={[Numb]} // Set the initial value here
      onChange={(e) => {
        updateNumb(e.target.value);
        UpdateModal(true); // Update state when value changes
      }}
      className="max-w-xs w-1/2"
    >
      {hours.map((t) => (
        <SelectItem key={t}>{`${t} giờ`}</SelectItem>
      ))}
    </Select>
  );
};

export default CustomSelectHour;
