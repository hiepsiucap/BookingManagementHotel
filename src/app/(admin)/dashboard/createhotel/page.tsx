/** @format */

"use client";
import { useFormStatus } from "react-dom"; // Sử dụng hook này để theo dõi trạng thái form
import { handleSubmit } from "./action";

import Submit from "@/components/ui/searchButton";
// Server action để xử lý form submission
import { Input, Select, SelectItem } from "@nextui-org/react";
const CreateHotel = () => {
  return (
    <section className="p-0 w-full  pl-6">
      <h1 className="text-2xl  pb-6">Tạo khách sạn</h1>
      <form
        className=" flex flex-col items-center space-y-6 "
        action={handleSubmit}
      >
        {" "}
        {/* Kết nối form với server action */}
        <Input type="text" name="name" label="Tên khách sạn" />
        <Input type="text" name="address" label="Địa chỉ khách sạn" />
        <Select label="Thành phố" name="city">
          <SelectItem key="Hồ Chí Minh" value="Hồ Chí Minh">
            Hồ Chí Minh
          </SelectItem>
          <SelectItem key="Đà Nẵng" value="Đà Nẵng">
            Đà Nẵng
          </SelectItem>
          <SelectItem key="Thừa Thiên Huế" value="Thừa Thiên Huế">
            Thừa Thiên Huế
          </SelectItem>
        </Select>
        <Input
          className=" pt-6"
          type="file"
          label="Ảnh đại diện"
          name="mainimage"
        ></Input>
        <Submit />
      </form>
    </section>
  );
};

export default CreateHotel;
