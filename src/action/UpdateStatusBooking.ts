"use server"
import { db } from "@/app/lib/db";
import { BookingStatus } from "@prisma/client";
const UpdateStatusBooking =async(formdata : FormData)=>{
     const booking_id= formdata.get("booking_id");
     const  status = formdata.get("status");
     try{
     if(booking_id && status)
     {
     const booking=await db.booking.update({
        where: {
            id: Number(booking_id)
        },
        data: {
            status: status as BookingStatus
        }

     })
     if(booking)
     {
        return {success: true, message: "Cập nhật trạng thái thành công"}
     }
     else throw new Error ("Cập nhật trạng thái thất bại")
    }
    return {success: false, message: "Không tìm thấy đơn đặt hàng"}
} catch(e){
        if(e instanceof Error)
        return {success: false, message: e.message }
    }
}
export default UpdateStatusBooking