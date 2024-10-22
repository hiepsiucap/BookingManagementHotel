/** @format */
/** @format */

"use server";
import { db } from "@/app/lib/db";
import FormAddAmenity from "@/components/FormAddAmenity";
import { fetchHotelList } from "@/action/GetHotel";
const AddAmenity = async () => {
  const listamenity = await db.amenity.findMany({});
  const listhotel = await fetchHotelList();
  return (
    <section className="p-0 w-full  pl-6">
      <FormAddAmenity
        listamenity={listamenity}
        listhotel={listhotel}
      ></FormAddAmenity>
    </section>
  );
};

export default AddAmenity;
