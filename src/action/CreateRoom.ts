"use server"
import { z } from "zod";
import { db } from "@/app/lib/db";
const RoomSchema = z.object({
  hotel_id: z.string().nonempty("Hotel is required"),
  description: z.string().nonempty("Description is required"),
});
type RoomInput = z.infer<typeof RoomSchema>;
export async function  handleRoomCreation(data: FormData) {
    try{
        const formData= Object.fromEntries(data.entries());
        const validatedData= RoomSchema.parse(formData);
        const resdata= await db.roomTypes.create({data:{
            hotel_id: Number(validatedData.hotel_id),
            description: validatedData.description
        }})
        const type= ['priceDay', 'priceHour', 'priceNight'];
        type.map(async(tp)=>{
              await db.rentalPrice.create({
            data:{
                type_rental:tp ,
                price: 0,
                room_type_id: resdata.id,
            }
           })
        })
            
        console.log("validated data: ", resdata);
        return {success: true, message: "Room created successfully", room: resdata}
    } catch(error)
    {
        if(error instanceof z.ZodError)
        {
            return {success: false , error: error.flatten().fieldErrors}
        }
         console.log(error);
    }
    return {success: false,  message: "Unexpected error occurred"}
}
