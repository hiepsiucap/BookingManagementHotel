"use server"
import { db } from "@/app/lib/db"
const GetBookingByRoom= async(formdata: FormData)=>{
    const room_id= formdata.get("room_id") as string;
    console.log(room_id)
    if(room_id)
    {
    const room= await db.booking.findMany({where:{
        room_type_id:Number(room_id),
    }, orderBy: [
        {
            start_date_time: 'desc'
        }
    ]})
    return room;
    }
    return [];
}
export default GetBookingByRoom
