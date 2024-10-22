/** @format */

"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useTransition } from "react";
import { fetchHotelList } from "@/action/GetHotel";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import Swal from "sweetalert2";
import { handleRoomCreation } from "@/action/CreateRoom";
import { CreateImageAction } from "./action";
import { zodResolver } from "@hookform/resolvers/zod";
// Server action để xử lý form submission
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
interface FilePreview {
  name: string;
  url: string;
  file: File;
}
interface Hotel {
  id: number;
  name: string;
  address: string;
  city: string;
  mainimage: string;
  latitude: number;
  longitude: number;
}
const RoomSchema = z.object({
  hotel_id: z.string(),
  description: z.string(),
});
type RoomInput = z.infer<typeof RoomSchema>;
const CreateHotel = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [isPending, startTransition] = useTransition();
  const [listhotel, setListHotel] = useState<Hotel[] | []>([]);
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  const onSumbitHandler: SubmitHandler<RoomInput> = (data) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("hotel_id", data.hotel_id);
      formData.append("description", data.description);
      try {
        const response = await handleRoomCreation(formData);
        if (response.success && response.room?.id) {
          const promise = previews.map(async (preview) => {
            const formData = new FormData();
            formData.set("image", preview.file);
            formData.set("room_id", response.room?.id.toString());
            await CreateImageAction(formData);
          });
          Promise.all(promise).then(() => {
            Swal.fire({
              icon: "success",
              title: "Tạo phòng thành công",
              text: "",
            });
            reset();
            setPreviews([]);
          });
        } else {
          throw new Error(`Oh No ${response.error} `);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Tạo phòng thất bại",
          text: "",
        });
        reset();
      }
    });
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RoomInput>({
    resolver: zodResolver(RoomSchema),
  });
  useEffect(() => {
    const getHotel = async () => {
      try {
        setListHotel(await fetchHotelList());
      } catch {
        return;
      }
    };
    getHotel();
  }, []);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newPreviews = files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      }));

      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };
  const handleFileUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newPreviews = files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      }));

      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };
  useEffect(() => {
    // Cleanup: Revoke all object URLs when previews change or component unmounts
    return () => {
      previews?.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);
  return (
    <section className="p-0 w-full  pl-6">
      <h1 className="text-2xl pb-6">Tạo phòng khách sạn</h1>
      <form
        onSubmit={handleSubmit(onSumbitHandler)}
        className=" flex flex-col space-y-6"
      >
        <Select
          {...register("hotel_id", { required: "Hotel is required" })}
          label="Chọn khách sạn"
          isInvalid={!!errors.hotel_id}
          errorMessage={errors.hotel_id?.message}
        >
          {listhotel &&
            listhotel.map((hotel) => {
              return (
                <SelectItem key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </SelectItem>
              );
            })}
        </Select>
        <Textarea
          {...register("description", { required: "Vui lòng điền mô tả" })}
          label="Mô tả phòng"
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message}
        ></Textarea>
        <h5 className=" text-lg mt-6 font-medium">Thêm ảnh </h5>
        {previews.length < 1 ? (
          <div className=" flex justify-center mt-6 items-center">
            <button
              type="button"
              onClick={handleButtonClick}
              className=" border w-2/3 flex flex-col items-center justify-center  p-48  border-dashed bg-green-100 bg-opacity-40"
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className=" h-14 text-green-600"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                  />
                </svg>
              </div>
              <h1 className=" text-green-600 text-medium font-bold ">
                Tải ảnh từ máy tính
              </h1>
              <p className=" font-light text-sm text-gray-500">
                Chấp nhận file: JPG, PNG
              </p>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {previews.map((file, index) => (
              <div
                className=" flex flex-col justify-between items-center"
                key={index}
              >
                <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md aspect-[3/4]">
                  <Image
                    src={file.url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 100vw, 
             (max-width: 1200px) 50vw, 
             33vw"
                    priority
                  />
                </div>
                <p className=" text-center  text-black text-sm p-1 truncate w-full">
                  {file.name}
                </p>
              </div>
            ))}
            {previews.length > 0 && (
              <div className=" h-64 flex space-x-2">
                <button
                  onClick={handleButtonClick}
                  type="button"
                  className=" opacity-25 hover:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className=" w-8 text-primary"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleButtonClick}
                  type="button"
                  className=" opacity-60 hover:opacity-100 flex flex-col items-center justify-center border-1 border-primary w-full rounded-lg border-dashed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className=" w-6 text-primary"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                  <p className=" text-primary text-sm">
                    Thêm ảnh mới <br></br> (định dạng jpg,png)
                  </p>
                </button>
              </div>
            )}
          </div>
        )}
        <div className=" pt-16 flex items-center justify-center w-full">
          <Button
            type="submit"
            isDisabled={isPending}
            className="  rounded-lg px-6 py-2 bg-primary text-white font-bold"
          >
            {" "}
            Tạo đặt phòng khách sạn
          </Button>
        </div>
      </form>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </section>
  );
};

export default CreateHotel;
