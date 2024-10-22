/** @format */
"use client";
import Image from "next/image";
import LocationComponent from "@/components/LocationComponent";
import Location from "@/components/Location";
import useLocation from "@/components/LocationComponent";
import { fetchHotelList } from "@/action/GetHotel";
import { startTransition, useEffect, useState } from "react";
import { useTransition } from "react";
import { groupHotelsByCity } from "../../../utils/groupHotel";
import FetchDistances from "@/action/FetchDistance";
type Hotel = {
  id: number;
  name: string;
  address: string;
  city: string;
  mainimage: string;
  latitude: number;
  longitude: number;
};
type UpdateHotel = {
  id: number;
  name: string;
  address: string;
  city: string;
  mainimage: string;
  latitude: number;
  longitude: number;
  distance: string;
};

type CityWithHotels = {
  city: string;
  hotels: Hotel[];
};
type CityWithUpdateHotels = {
  city: string;
  hotels: UpdateHotel[];
};
export default function Home() {
  const { Mylocation, error } = useLocation();
  const [isPending, createTransition] = useTransition();
  const scrollToSection = (sectionId: any) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  const [location, changeLocation] = useState<CityWithHotels[] | null>(null);
  const [updatelocate, changeupdatelocate] = useState<
    CityWithUpdateHotels[] | CityWithHotels[] | null | any
  >(null);
  useEffect(() => {
    const a = async () => {
      const data = await fetchHotelList();
      if (data) {
        changeLocation(groupHotelsByCity(data));
        createTransition(() => {
          changeupdatelocate(groupHotelsByCity(data));
        });
      }
    };
    a();
  }, []);
  useEffect(() => {
    const UpLo = async () => {
      if (location && location?.length > 0) {
        const locationPromise = location?.map(async (location) => {
          const hotels = location.hotels;
          if (
            hotels.length > 0 &&
            Mylocation.latitude &&
            Mylocation.longitude
          ) {
            try {
              const PromiseHotel = hotels.map(async (hotel) => {
                const formdata = new FormData();
                formdata.set("userlatitude", String(Mylocation.latitude));
                formdata.set("userlongtitude", String(Mylocation.longitude));
                formdata.set("hotelatitude", hotel.longitude.toString());
                formdata.set("hotellongtitude", hotel.latitude.toString());
                console.log(String(Mylocation.longitude));
                const response = await FetchDistances(formdata);
                console.log(response);
                if (response?.success) {
                  return { ...hotel, distance: response.distance };
                } else {
                  return { ...hotel, distance: "0 km" };
                }
              });
              const hotel = await Promise.all(PromiseHotel);
              return { ...location, hotels: hotel };
            } catch (err) {
              console.log(err);
              return { error: "", location };
            }
          }
          console.log(location);
          return { location };
        });

        const updatelocation = await Promise.all(locationPromise);
        createTransition(() => {
          changeupdatelocate(updatelocation);
        });
      }
    };

    UpLo();
  }, [location, Mylocation]);
  console.log(updatelocate);
  return (
    <main className=" pt-2">
      <div className=" bg-hero-pattern rounded-2xl min-h-screen relative bg-url md:container mx-auto w-full bg-cover ">
        <div className="w-1/2  rounded-2xl pl-10  min-h-screen bg-slate-700 flex items-center bg-opacity-15">
          <div>
            <h1 className=" pb-16  text-5xl font-sans text-slate-50 leading-relaxed  font-bold  ">
              Đặt phòng ngay với ưu đãi hấp dẫn tại{" "}
              <p className=" text-6xl">Lá Hotel </p>
            </h1>
            <button className=" text-bold  text-lg px-8 py-2 text-white bg-primary rounded-2xl">
              Đặt ngay
            </button>
          </div>
        </div>
      </div>

      <div className=" bg-white rounded-2xl min-h-screen  bg-url md:container mx-auto p-10 w-full bg-cover ">
        <div className="text-center text-primary font-sans text-4xl scale-110 font-bold">
          ĐẶT PHÒNG
        </div>
        <div className=" text-primary p-2 text-center">
          Bạn muốn đặt phòng ở đâu?
        </div>
        <div className=" flex space-x-4 pt-5">
          <button
            onClick={() => scrollToSection("Đà Nẵng")}
            className=" flex flex-col space-y-5 items-center w-full"
          >
            <div className=" relative w-full h-64">
              <Image
                src="https://res.cloudinary.com/dhhuv7n0h/image/upload/v1723457563/cau-rong-da-nang-1-1_mw8twn.jpg"
                alt="danang"
                fill
                className=" rounded-xl object-cover "
              ></Image>
            </div>
            <div className=" text-green-500 font-bold text-2xl">Đà Nẵng</div>
          </button>
          <button
            onClick={() => scrollToSection("Hồ Chí Minh")}
            className=" flex flex-col space-y-5 items-center w-full"
          >
            <div className=" relative w-full h-64">
              <Image
                src="https://res.cloudinary.com/dhhuv7n0h/image/upload/v1723457549/dien-tich-cac-quan-tai-ho-chi-minh-1-16717832922811126226268_pqkymd.jpg"
                alt="danang"
                fill
                className=" rounded-xl object-cover"
              ></Image>
            </div>
            <div className=" text-green-500 font-bold text-2xl">
              Hồ Chí Minh
            </div>
          </button>
          <button
            onClick={() => scrollToSection("Thừa Thiên Huế")}
            className=" flex flex-col space-y-5 items-center w-full"
          >
            <div className=" relative w-full h-64">
              <Image
                src="https://res.cloudinary.com/dhhuv7n0h/image/upload/v1723457554/kham-pha-top-25-dia-diem-du-lich-thua-thien-hue-dep-quen-loi-ve_kwspts.jpg"
                fill
                alt="hue"
                className=" w-full rounded-xl object-cover"
              ></Image>
            </div>
            <div className=" text-green-500 font-bold text-2xl">
              Thừa Thiên Huế
            </div>
          </button>
        </div>
        <div className="flex flex-col w-full space-y-6  py-32">
          {isPending && (
            <div className=" animate-spin flex justify-center items-center">
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
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </div>
          )}
          {updatelocate &&
            updatelocate.map((lc: any) => {
              return (
                <Location
                  longitude={Mylocation.longitude}
                  latitude={Mylocation.latitude}
                  key={lc.city}
                  city={lc.city}
                  hotels={lc.hotels}
                ></Location>
              );
            })}
        </div>
      </div>
    </main>
  );
}
