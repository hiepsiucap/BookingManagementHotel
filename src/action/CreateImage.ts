"use server"
import { z } from "zod";
import { db } from "@/app/lib/db";
const ImageSchema = z.object({
  room_type_id: z.string(),
  image_link: z.string().nonempty("Image Link is required"),
});
type ImageInput = z.infer<typeof ImageSchema>;
export async function  handleImageCreation(data: FormData) {
    try{
        const formData= Object.fromEntries(data.entries());
        const validatedData= ImageSchema.parse(formData);
        const resdata= await db.image.create({data:{
            room_type_id: Number(validatedData.room_type_id),
            image_link: validatedData.image_link
        }})
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
