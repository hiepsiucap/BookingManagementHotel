/** @format */

"use server";
import { z } from "zod";
import { db } from "@/app/lib/db";
import { PrismaClient, PaymentMethod } from "@prisma/client";
export const AdminCreateBooking = async (formdata: FormData): Promise<any> => {
  const start_date_time = formdata.get("start_date_time") as string;
  const check_out_time = formdata.get("check_out_time") as string;
  const startHour = formdata.get("startHour") as string;
  const numbDay = formdata.get("numbDay") as string;
  const roomTypesId = formdata.get("room_type_id") as string;
  const numbHour = formdata.get("numbHour") as string;
  const TypeRent = formdata.get("TypeRent") as string;
  const phone_number = "admin";
  const user_name = "admin";
  const email = "admin";
  const total_price = "0";
  const special_request = "No";
  const paymentMethod = "cash";
  const checkin_date = new Date(start_date_time);
  const checkout_date = new Date(check_out_time);
  try {
    const roomTypes = await db.roomTypes.findUnique({
      where: {
        id: Number(roomTypesId),
      },
      include: {
        bookings: true,
        rentalPrices: true,
      },
    });
    if (roomTypes) {
      const isAvai = roomTypes.bookings.filter((booking) => {
        if (booking.status === "cancelled") return false;
        const checkout_time = new Date(booking.check_out_time || "");
        checkout_time.setHours(checkout_time.getHours() + 1);
        const checkin_time = new Date(booking.start_date_time || "");
        checkin_time.setHours(checkout_time.getHours() + 1);
        if (booking.check_out_time) {
          if (checkin_date > checkout_time) return false;
          if (checkout_date < checkout_date) return false;
        }
        return true;
      });
      if (isAvai.length > 0)
        return { success: false, message: "Phòng bạn đặt đã hết", reset: true };

      let price = {
        priceHour: 0,
        priceNight: 0,
        priceDay: 0,
      };
      let rentalid: number | null = null;
      roomTypes.rentalPrices.forEach((rental) => {
        price = { ...price, [rental.type_rental]: rental.price };
        if (rental.type_rental == TypeRent) rentalid = rental.id;
      });
      let totalprice = 0;
      if (TypeRent == "priceHour") {
        if (Number(startHour) < 22 && Number(startHour) + Number(numbHour) > 22)
          totalprice =
            price?.priceNight +
            price?.priceHour *
              Math.ceil(Number(startHour) + Number(numbHour) - 22);
        else if (Number(startHour) > 22 || Number(startHour) < 6) {
          if (
            Number(numbHour) + (Number(startHour) % 24) > 12 &&
            Number(startHour) < 22
          )
            totalprice =
              price?.priceNight +
              price.priceHour *
                Math.ceil(Number(numbHour) + Number(startHour) - 12);
          totalprice = price?.priceNight;
        } else totalprice = price?.priceHour * (Number(numbHour) + 3);
      } else if (TypeRent == "priceNight") {
        if (Number(startHour) < 22 && Number(startHour) > 14)
          return (totalprice =
            Math.ceil(22 - Number(startHour)) * price.priceHour +
            price.priceNight);
        else return (totalprice = price.priceNight);
      } else if (TypeRent == "priceDay") {
        if (Number(startHour) > 22 || Number(startHour) < 6)
          totalprice =
            price.priceNight + price.priceDay * (Number(numbDay) - 1);
        else if (Number(startHour) < 14)
          return (totalprice =
            Math.ceil(14 - Number(startHour)) * price.priceHour +
            price.priceDay * Number(numbDay));
        else totalprice = price.priceDay * Number(numbDay);
      }
      if (rentalid) {
        const booking = await db.booking.create({
          data: {
            phone_number: phone_number,
            user_name: user_name,
            special_request,
            total_price: 0,
            start_date_time: checkin_date,
            payment_method: paymentMethod as PaymentMethod,
            room_type_id: Number(roomTypesId),
            check_out_time: checkout_date,
            rental_price_id: rentalid,
            status: "Confirmed",
          },
        });
        return { success: true, booking: booking };
      }
    }

    return { success: false, message: "Kiểm tra thông tin của bạn ! " };
  } catch (e) {
    return { success: false, message: "Kết nối bị lỗi, xin lỗi khách hàng ! " };
  }
};
