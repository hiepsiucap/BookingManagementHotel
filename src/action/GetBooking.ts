"use server"
import { db } from "@/app/lib/db"
import { BookingStatus } from "@prisma/client";
const GetBooking =async(formData: FormData)=>{
        const status= formData.get("status") as string;
          try{
        if(status)
        {
            const data= await db.booking.findMany({
               where:{
                 status: status as BookingStatus,
               },
               take: 10,
               skip:0,
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
            return {success: true, data: data};
        
        }
          const  data =await db.booking.findMany({
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
          });
          return{success: true, data: data};
        }catch(e){
            return {success: false , message: "Failed to get booking"}
        }
}
export default GetBooking