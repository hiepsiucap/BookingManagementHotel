/** @format */
/** @format */

"use server";
import { db } from "@/app/lib/db";
import FormAddAmenity from "@/components/FormAddAmenity";
import { fetchHotelList } from "@/action/GetHotel";
import FormCreatePrice from "@/components/FormCreatePrice";
const CreatePrice = async () => {
  const listamenity = await db.amenity.findMany({});
  const listhotel = await fetchHotelList();
  return (
    <section className="p-0 w-full  pl-6">
      <FormCreatePrice listhotel={listhotel}></FormCreatePrice>
    </section>
  );
};

export default CreatePrice;
