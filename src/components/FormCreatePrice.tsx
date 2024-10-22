/** @format */
"use client";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleSubmit } from "@/app/(admin)/dashboard/addamenity/action";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/react";
import { FindRoomByHotel } from "@/action/GetRoomByHotel";
import { Button } from "@nextui-org/react";
import { useTransition } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { handleAddAmenity } from "@/action/AddAmenity";
import { useState } from "react";
import { GetPriceByRoom } from "@/action/GetPrice";
import { CreatePrice } from "@/action/CreatePrice";
const addPriceSchema = z.object({
  room_id: z.string(),
  priceDay: z.string(),
  priceHour: z.string(),
  priceNight: z.string(),
});
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
type InitialArrayPriceType = {
  priceDay: number;
  priceHour: number;
  priceNight: number;
};
const InitialArrayPrice = {
  priceDay: 0,
  priceHour: 0,
  priceNight: 0,
};
type addPriceInput = z.infer<typeof addPriceSchema>;
const FormCreatePrice = ({ listhotel }: { listhotel: Hotel[] }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<addPriceInput>({
    resolver: zodResolver(addPriceSchema),
  });
  console.log(errors);
  const [isPending, startTransition] = useTransition();
  const [listroom, changeListroom] = useState<ReturnRoom[]>([]);
  const [listprice, changelistprice] =
    useState<InitialArrayPriceType>(InitialArrayPrice);
  const [disableprice, changedisableprice] = useState(true);
  const onSubmitHandler = (data: addPriceInput) => {
    console.log(data);
    const formdata = new FormData();
    formdata.set("room_id", data.room_id);
    formdata.set("price_day", data.priceDay);
    formdata.set("price_hour", data.priceHour);
    formdata.set("price_night", data.priceNight);
    startTransition(async () => {
      try {
        const response = await CreatePrice(formdata);
        if (response?.success) {
          Swal.fire({
            icon: "success",
            title: response.message,
          });
        } else throw new Error(" ");
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
    const Listroom = await FindRoomByHotel(Number(e.target.value));
    changeListroom(Listroom);
  };
  const onChangeRoomHandler = async (value: any) => {
    const listprice = await GetPriceByRoom(Number(value.target.value));
    if (listprice.length > 0) {
      listprice.map((price) => {
        changelistprice((prev) => {
          return { ...prev, [price.type_rental]: price.price };
        });
      });
    }
    changedisableprice(false);
  };
  return (
    <>
      <div className="flex flex-col space-y-6 ">
        <h5 className=" text-2xl ">Cập nhật giá</h5>
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
          <Controller
            name="room_id"
            control={control} // Pass the control prop from useForm
            defaultValue="" // Set default value
            render={({ field }) => (
              <Select
                {...field} // This connects the select component with react-hook-form
                label="Select Room"
                placeholder="Select Room"
                className=" text-black"
                isInvalid={!!errors.room_id}
                errorMessage={errors.room_id?.message}
                onChange={(value) => {
                  field.onChange(value); // Notify react-hook-form of the change
                  onChangeRoomHandler(value); // Custom handler logic
                }}
              >
                {listroom.map((room) => (
                  <SelectItem
                    key={room.id}
                    value={room.id.toString()}
                  >
                    {room.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <Input
            type="number"
            {...register(`priceDay`, {
              required: `priceDay is required`,
            })}
            label="Price Day "
            placeholder="Select Price"
            value={listprice.priceDay.toString()}
            isInvalid={!!errors.priceDay}
            disabled={disableprice}
            errorMessage={errors?.priceDay?.message}
            onChange={(e) => {
              changelistprice((prev) => {
                return { ...prev, priceDay: Number(e.target.value) };
              });
            }}
          ></Input>
          <Input
            {...register(`priceHour`, {
              required: `priceHour is required`,
            })}
            label="Price Hour "
            type="number"
            placeholder="Select Price"
            value={listprice.priceHour.toString()}
            disabled={disableprice}
            isInvalid={!!errors.priceHour}
            errorMessage={errors?.priceHour?.message}
            onChange={(e) => {
              changelistprice((prev) => {
                return { ...prev, priceHour: Number(e.target.value) };
              });
            }}
          ></Input>
          <Input
            {...register(`priceNight`, {
              required: `priceNight is required`,
            })}
            label="Price Night "
            type="number"
            disabled={disableprice}
            value={listprice.priceNight.toString()}
            placeholder="Select Price"
            isInvalid={!!errors.priceNight}
            errorMessage={errors?.priceNight?.message}
            onChange={(e) => {
              changelistprice((prev) => {
                return { ...prev, priceNight: Number(e.target.value) };
              });
            }}
          ></Input>
          <Button
            isDisabled={isPending}
            type="submit"
            className=" bg-green-400 px-10"
          >
            Thêm
          </Button>
        </form>
      </div>
    </>
  );
};
export default FormCreatePrice;
