/** @format */
"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleSubmit } from "@/app/(admin)/dashboard/addamenity/action";
import { Input } from "postcss";
import { Select, SelectItem } from "@nextui-org/select";
import { FindRoomByHotel } from "@/action/GetRoomByHotel";
import { Button } from "@nextui-org/react";
import { useTransition } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { handleAddAmenity } from "@/action/AddAmenity";
import { useState } from "react";
const addAmenitySchema = z.object({
  room_id: z.string(),
  amenity_id: z.string(),
});
type Amenity = {
  id: number;
  description: string;
  image: string;
};
interface ReturnRoom {
  name: string;
  id: number;
  status: string;
  maxtime: Date;
}
type ListRoomType = {
  id: number;
  hotel_id: number;
  description: string;
};
type Hotel = {
  id: number;
  name: string;
  address: string;
  city: string;
  mainimage: string;
  latitude: number;
  longitude: number;
};
type addAmenityInput = z.infer<typeof addAmenitySchema>;
const FormAddAmenity = ({
  listamenity,
  listhotel,
}: {
  listamenity: Amenity[];
  listhotel: Hotel[];
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<addAmenityInput>({
    resolver: zodResolver(addAmenitySchema),
  });
  const [isPending, startTransition] = useTransition();
  const [listroom, changeListroom] = useState<ReturnRoom[]>([]);
  const onSubmitHandler = (data: addAmenityInput) => {
    const formdata = new FormData();
    formdata.set("room_id", data.room_id);
    formdata.set("amenity_id", data.amenity_id);
    startTransition(async () => {
      try {
        const response = await handleAddAmenity(formdata);
        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "Add Success",
          });
        } else throw new Error((response.message as string) || "");
      } catch (error) {
        if (error instanceof Error)
          Swal.fire({
            icon: "error",
            title: "Fail to Add Amenity in Room",
            text: error?.message || "",
          });
      }
    });
  };
  const onChangeHandler = async (e: any) => {
    console.log(Number(e.target.value));
    const Listroom = await FindRoomByHotel(Number(e.target.value));
    changeListroom(Listroom);
  };
  return (
    <>
      <div className="flex flex-col space-y-6 ">
        <h5 className=" text-2xl ">Thêm Tiện ích</h5>
        <Select
          label="Select Hotel"
          placeholder="Select Hotel"
          onChange={(e) => {
            onChangeHandler(e);
          }}
        >
          {listhotel.map((hotel) => {
            return (
              <SelectItem
                key={hotel.id}
                value={hotel.id}
              >
                {hotel.name}
              </SelectItem>
            );
          })}
        </Select>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className=" flex flex-col space-y-6 justify-center items-center"
        >
          <Select
            {...register("room_id", { required: "Amenity is required" })}
            label="Select Room"
            placeholder="Select Room"
            isInvalid={!!errors.room_id}
            errorMessage={!!errors.room_id?.message}
          >
            {listroom &&
              listroom.map((room) => {
                return (
                  <SelectItem
                    key={room.id}
                    value={room.id}
                  >
                    {room.name}
                  </SelectItem>
                );
              })}
          </Select>
          <Select
            {...register("amenity_id", { required: "Amenity is required" })}
            label="Select Amenity"
            placeholder="Select Room"
            isInvalid={!!errors.amenity_id}
            errorMessage={!!errors.amenity_id?.message}
          >
            {listamenity &&
              listamenity.map((amenity) => {
                return (
                  <SelectItem
                    key={amenity.id}
                    value={amenity.id}
                  >
                    {/* <div className=" flex flex-row items-center  p-2 space-x-2">
                      <Image
                        width={32}
                        height={32}
                        src={amenity.image}
                        alt={amenity.description}
                      ></Image>
                      <div>{amenity.description}</div>
                    </div> */}
                    {amenity.description}
                  </SelectItem>
                );
              })}
          </Select>
          <Button
            isDisabled={isPending}
            type="submit"
            className=" bg-green-400 px-10  "
          >
            Thêm
          </Button>
        </form>
      </div>
    </>
  );
};
export default FormAddAmenity;
