/** @format */
"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import FetchDistances from "@/action/FetchDistance";
type Hotel = {
  id: number;
  name: string;
  address: string;
  city: string;
  mainimage: string;
  latitude: number;
  longitude: number;
  distance?: string;
};

const Location = ({
  city,
  hotels,
  longitude,
  latitude,
}: {
  city: string;
  longitude: any;
  latitude: any;
  hotels: Hotel[];
}) => {
  return (
    <div id={city} className=" w-full pb-12">
      <h1 className=" text-4xl font-bold  text-green-500 pb-8">{city}</h1>
      <div className=" grid grid-cols-2 gap-8  w-full">
        {hotels &&
          hotels.map((hotel, index) => (
            <Link
              href={hotel.id.toString()}
              key={index}
              className=" flex flex-col items-center space-y-2"
            >
              <div className=" relative w-full h-96">
                <Image
                  src={hotel.mainimage}
                  alt={`Image of ${hotel.address}`}
                  sizes=""
                  fill
                  className="object-cover  rounded-xl" // Ensure object-cover is used consistently
                />
              </div>
              <p className=" flex items-end space-x-1 text-lg text-slate-600 ">
                <p>{hotel.address} </p>
                {hotel.distance ? (
                  <span className=" text-sm pb-1  w-40 italic text-gray-500">
                    {"("} cách {` ${hotel.distance}`} {")"}
                  </span>
                ) : (
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="size-6 animate-spin"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                  </span>
                )}
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Location;
