/** @format */
"use client";
import { Select, SelectItem } from "@nextui-org/react";

const CustomSelectDay = ({
  NumbDay,
  updateNumbDay,
  UpdateModal,
}: {
  NumbDay: string;
  updateNumbDay: any;
  UpdateModal: any;
}) => {
  const hours = [];
  for (let i = 1; i <= 30; i++) {
    hours.push(i);
  }

  return (
    <Select
      label="số ngày thuê:"
      placeholder="Chọn số ngày thuê "
      disabledKeys={[1, 2]}
      selectedKeys={[NumbDay]}
      className="max-w-xs w-1/2"
      onChange={(e) => {
        updateNumbDay(e.target.value);
        UpdateModal(true);
      }}
    >
      {hours.map((t) => (
        <SelectItem key={t}>{`${t} ngày`}</SelectItem>
      ))}
    </Select>
  );
};

export default CustomSelectDay;
