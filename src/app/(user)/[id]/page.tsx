/** @format */
"use server";
import DatePickers from "@/components/DatePicker";
import Gallery from "@/components/Gallery";
import { Button } from "@nextui-org/react";
import CustomSelect from "@/components/Select";
import { CameraIcon } from "@/assets/CameraIcon";
import { GetServerSideProps } from "next";
import EachRoom from "@/components/EachRoom";
import ChooseRoom from "@/components/ChooseRoom";
import { GetRoomInfo } from "@/action/GetRoomInfo";
import { transformCloudinaryUrl } from "../../../../utils/transformCloudinaryUrl";
const getPriceKey = (typeRental: string) => {
  switch (typeRental) {
    case "priceDay":
      return "priceDay";
    case "priceNight":
      return "priceNight";
    case "priceHour":
      return "priceHour";
    default:
      throw new Error(`Invalid type_rental: ${typeRental}`);
  }
};
interface ImageType {
  original: string;
  thumbnail: string;
}
interface ReturnListRoom {
  images: ImageType[];
  name: string;
  utilities: string[];
  price: {
    priceDay: number;
    priceNight: number;
    priceHour: number;
  };
  id: number;
}
type Props = {
  listroom: ReturnListRoom[]; // Update the prop type to match the structure you're passing
};
interface PostPageProps {
  params: {
    id: string;
  };
}
type AmenityType = {
  name: string;
  image: string;
};
type CheckInOutType = {
  priceDay: Date;
  priceHour: Date;
  priceNight: Date;
};
export default async function EachLocation({ params }: PostPageProps) {
  const { id } = params;
  const data = await GetRoomInfo(id);
  let listroom: ReturnListRoom[] | undefined = [];
  let checkin: CheckInOutType | null = null;
  let checkout: CheckInOutType | null = null;
  let images: ImageType[] = [];
  if (data?.success) {
    checkin = data?.checkin || null;
    checkout = data?.checkout || null;
    listroom = data.data?.roomTypes?.map((room) => {
      const utilities = room.roomAmenity.map((amenities) => {
        return amenities.amenity.description;
      });
      const image = room.images.map((img) => {
        return {
          original: transformCloudinaryUrl(img.image_link, 1000, 600),
          thumbnail: transformCloudinaryUrl(img.image_link, 250, 250),
        };
      });
      const price = {
        priceDay: 0,
        priceNight: 0,
        priceHour: 0,
      };
      room.rentalPrices.map((prc: any) => {
        price[getPriceKey(prc.type_rental)] = prc.price;
      });
      console.log(price);
      return {
        id: room.id,
        images: image,
        name: room.description,
        utilities: utilities,
        price: { ...price, priceHour: price.priceHour },
      };
    });
    let listamenity: AmenityType[] = [];
    data.data?.roomTypes?.map((room) => {
      listamenity = listamenity.concat(
        room.roomAmenity.map((amenity) => {
          return {
            name: amenity.amenity.description,
            image: amenity.amenity.image,
          };
        })
      );
    });
    data.data?.roomTypes?.map((room) => {
      images = images.concat(
        room.images.map((img) => {
          return {
            original: transformCloudinaryUrl(img.image_link, 1000, 600),
            thumbnail: transformCloudinaryUrl(img.image_link, 250, 250),
          };
        })
      );
    });
    console.log(images);
  }
  return (
    <div className="w-full">
      <div className="w-2/3 mx-auto">
        <Gallery images={images}></Gallery>
        <div className=" py-4 px-3 flex flex-col space-y-2">
          <div className=" text-4xl font-bold text-green-500">
            {data?.data?.name}
          </div>
          <div className=" flex ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <div>{data?.data?.address}</div>
          </div>
          <div className=" border "></div>
          <div className="">
            <div className=" text-xl font-bold text-green-500">Tiện ích</div>
            <div className=" flex space-x-12 py-6">
              <div className=" flex p-2 flex-col items-center space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1"
                  stroke="currentColor"
                  className=" w-10 h-10"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
                <div className=" text-slate-700">Smart TV</div>
              </div>
              <div className=" flex p-2 flex-col items-center space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1"
                  stroke="currentColor"
                  className=" w-10 h-10"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>

                <div className=" text-slate-700">Lễ tân 24/24</div>
              </div>
              <div className=" flex p-2 flex-col items-center space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1"
                  stroke="currentColor"
                  className=" w-10 h-10"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>

                <div className=" text-slate-700">Chỗ để ô tô</div>
              </div>
            </div>
          </div>
          <div className=" border "></div>
          {listroom && checkin && checkout && (
            <ChooseRoom
              listroom={listroom}
              checkin={checkin}
              checkout={checkout}
              name={data?.data?.name || ""}
              id={data?.data?.id?.toString() || ""}
            ></ChooseRoom>
          )}
        </div>
      </div>
    </div>
  );
}
