"use server"
import { db } from "@/app/lib/db"
import { calculateHoursBetweenDates } from "@/func/Format";
const Checkout = async(formData: FormData)=>{
          const booking_id= formData.get("booking_id");
   console.log(booking_id)
   if(booking_id)
   {
     let data= await db.booking.findFirst({where: {
       id: Number(booking_id )
     }, include: {
        rental_price: true
     }})
     console.log(data)
     if(data?.check_out_time)
    {
     data.check_out_time= new Date();
    const hour= calculateHoursBetweenDates(data?.start_date_time, data.check_out_time)
     const total_price=  (Math.ceil(hour)+3)*data.rental_price.price;
     data.total_price=total_price;
      return {success: true, data }
    }
   }
   return {success: false, message: "Không tồn tại booking"}
}
export default Checkout