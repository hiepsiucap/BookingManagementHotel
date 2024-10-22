"use server"
import { db } from "@/app/lib/db";
interface Price {
  id: number;
  price: number;
  type_rental: string;
  room_type_id: number;
}
export async function GetPriceByRoom(roomid: number): Promise<Price[]> {
  // Assuming db is configured properly
  const data = await db.rentalPrice.findMany({
    where: {
       room_type_id: roomid 
    }
  });
  return data 
}