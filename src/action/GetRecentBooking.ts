"use server"
import { db } from "@/app/lib/db"
import { BookingStatus } from "@prisma/client";
const GetRecentBooking =async()=>{
          try{
       
            const data= await db.booking.findMany({
               where:{
              
               },
               include: {
                room_type: {
                    include: {
                        hotel: true
                    }
                }
            
               },
               orderBy: {
                start_date_time: 'desc',
               }
            })
            return {success: true, data:data}
        } catch {
                return {success: false, message: "Failed To Get Booking"}
            }
}
export default GetRecentBooking