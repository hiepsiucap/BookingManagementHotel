"use server"
import { z } from "zod";
import { db } from "@/app/lib/db";
import { error } from "console";
const ImageSchema = z.object({
  room_id: z.string().nonempty("Room Id is required"),
  amenity_id: z.string().nonempty("Amenity Id is required"),
});
type ImageInput = z.infer<typeof ImageSchema>;
export async function  handleAddAmenity(data: FormData) {
    try{
        const formData= Object.fromEntries(data.entries());
        const validatedData= ImageSchema.parse(formData);
       const check = await db.roomAmenity.findMany({
  where: {
    AND: [
      { room_id: Number(validatedData.room_id) },
      { amenity_id: Number(validatedData.amenity_id) },
    ],
  },
});
        if(check.length>0) throw new Error("The Amenity is existed in this Room")
        const resdata= await db.roomAmenity.create({data:{
            room_id: Number(validatedData.room_id),
            amenity_id: Number(validatedData.amenity_id),
        }})
        console.log("validated data: ", resdata);
        return {success: true, message: "Room created successfully", room: resdata}
    } catch (error: unknown) {
    if (error instanceof z.ZodError) {
        return { success: false, error: error.flatten().fieldErrors };
    } else if (error instanceof Error) {
       
        return { success: false, message: error.message };
    } else {
        return { success: false, message: String(error) || "An unexpected error occurred" };
    }
}
    return {success: false,  message: error}
}
