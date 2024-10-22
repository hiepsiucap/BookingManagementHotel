/** @format */

"use client";
import { useFormStatus } from "react-dom"; // Sử dụng hook này để theo dõi trạng thái form
import { handleSubmit } from "./action";

import Submit from "@/components/ui/searchButton";
// Server action để xử lý form submission
import { Input } from "@nextui-org/react";
const CreateAmenity = () => {
  return (
    <section className="p-0 w-full  pl-6">
      <h1 className="text-2xl pb-6">Tạo tiện ích</h1>
      <form
        className=" flex flex-col space-y-6 items-center "
        action={handleSubmit}
      >
        {" "}
        {/* Kết nối form với server action */}
        <Input type="text" name="description" label="Tên tiện ích" />
        <Input
          className=" pt-6"
          type="file"
          label="Ảnh tiện ích"
          name="image"
        ></Input>
        <Submit />
      </form>
    </section>
  );
};

export default CreateAmenity;
