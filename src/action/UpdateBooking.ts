'use server'
import { db } from "@/app/lib/db"
import { Booking } from "@prisma/client"
const UpdateBooking=async(data : Booking)=>{

    if(data.id )
    {
    const updateCar= await db.booking.update({
        where: {
            id: data.id 
        },
        data: {
            total_price: data.total_price,
            check_out_time: new Date(),
            status: "check_out"
        }
    })
    return {success: true}
} 
return {success: false}
}
export default UpdateBooking