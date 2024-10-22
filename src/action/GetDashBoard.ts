"use server"
import { db } from "@/app/lib/db"
const GetDashBoard=async()=>{
    
    const totalbooking = await db.booking.aggregate({
        _sum :{
            total_price: true
        },
        where: {
            is_paid: false,
        }
    })
    const now= new Date();
    const theroom = await db.roomTypes.findMany({
        include:{
            bookings: true
        }
    })
    const listroom=theroom.filter((room)=>{
          const isAva= room.bookings.filter((booking)=>{
                if(booking.check_out_time && booking.start_date_time)
                if(booking.check_out_time> now && now> booking.start_date_time )
                {
                    return true;
                }
                return false;
          })
          if(isAva.length>0) return false;
          return true;
    })
     console.log(listroom.length)
    const totalroom =await db.roomTypes.count();
    console.log(totalbooking, totalroom,)
    return {success: true ,data:{ totalbooking:totalbooking._sum.total_price, totalroom: theroom.length, availableroom: listroom.length  }}
}
export default GetDashBoard