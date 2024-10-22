"use server"
import { db } from "@/app/lib/db";
interface Hotel {
  id: number;
  name: string;
  address: string;
  city: string;
  mainimage: string;
  latitude: number;
  longitude: number;
}
export async function fetchHotelList(): Promise<Hotel[]> {
  // Assuming db is configured properly
  const data = await db.hotel.findMany({});
  return data;
}