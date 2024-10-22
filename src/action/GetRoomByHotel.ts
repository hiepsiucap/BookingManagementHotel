"use server"
import { db } from "@/app/lib/db";
  interface ReturnRoom {
    name: string;
    id: number;
    status: string;
    maxtime: Date,
    bookingid: number| null 
   }
export async function FindRoomByHotel(hotelId: number) : Promise<ReturnRoom[] | undefined> {
 try{
   const data= await db.roomTypes.findMany({
    where:{
        hotel_id: hotelId,
    },
    include: {
      bookings: true,
    }
   });
 
const nowDate = new Date();
const relaxBefore = new Date(nowDate); 
relaxBefore.setHours(nowDate.getHours() - 2);
const relaxAfter = new Date(nowDate); 
relaxAfter.setHours(nowDate.getHours() + 4);
const relaxAfterBig = new Date(nowDate);
relaxAfterBig.setHours(nowDate.getHours() + 12);

   const response = await data.map((room)=> {
      let maxtime =new Date();
      let bookingid= null;
         const booking = room.bookings.filter((booking)=>{
            if(booking.status=="cancelled") return false;
             const checkout_time=new Date(booking.check_out_time || "");
             if(booking.start_date_time>relaxAfter || checkout_time<relaxBefore) return false;
             if(maxtime< checkout_time) 
              {
                maxtime= new Date(checkout_time); 
                bookingid=booking.id     
              }      
             return true;
         })
         if(booking.length>0) return {
           name:room.description,
           id: room.id,
           status: "red",
           maxtime,
           bookingid: bookingid
         }
       maxtime=new Date();
       let mintime= new Date(room?.bookings[0]?.start_date_time || "");
            mintime.setHours(mintime.getHours()-2);
            if(room.bookings.length>0)
            {
           const anobooking = room.bookings.filter((booking)=>{
               if(booking.status=="cancelled") return false;
             const checkout_time=new Date(booking.check_out_time || "");
             if(booking.start_date_time>relaxAfterBig || checkout_time<nowDate) 
              {
                const Before= new Date(booking.start_date_time);
                Before.setHours(Before.getHours()-2);
                if(Before<mintime) mintime= new Date(Before)
                return false;
              }
             if(maxtime< checkout_time) maxtime= checkout_time;            
             return true;
         })
          maxtime.setHours(maxtime.getHours()+2);
         if(anobooking.length>0) return {
           name:room.description,
           id: room.id,
           status: "yellow",
           bookingid : null,
           maxtime,

         }
         return {
          name: room.description,
          id:room.id,
          status: "green",
          bookingid : null,
          maxtime: mintime,
         }
        }

        return {
        name:room.description,
        id:room.id,
        status: "green",
        bookingid: null,
        maxtime: new Date(maxtime.setFullYear(3000))
        } 

      }) 
         return response;
   }
 catch(e)
 {
  if(e instanceof Error)
  {
  throw new Error(e.message);
  }
 }
    
}