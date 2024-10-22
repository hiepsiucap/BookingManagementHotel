"use server"
import { db } from "@/app/lib/db"
import { checkPrime } from "crypto";
const getPriceKey = (typeRental: string) => {
  switch (typeRental) {
    case "priceDay":
      return "priceDay";
    case "priceNight":
      return "priceNight";
    case "priceHour":
      return "priceHour";
    default:
      throw new Error(`Invalid type_rental: ${typeRental}`);
  }
};
export const GetRoomInfo= async(id: string)=>{
    try{
    const data= await db.hotel.findUnique(
        {
            where: {
               id: Number(id)
            },
        
            include:{
            roomTypes: {
            include:{
            images: true,
            rentalPrices: true,
            bookings: true,
            roomAmenity: {
        include: {
          amenity: true, // Fetch amenities related to the room
        },}}}
        }}
    )
    const date= new Date();
    const startHour=date.getMinutes()>30 ? date.getHours()+1 : date.getHours()+0.5;
    if(date.getMinutes()>=30) 
    {
        date.setHours(date.getHours()+1);
        date.setMinutes(0);
    }
    else date.setMinutes(30);
    const checkin={
        priceDay: new Date(date),
        priceHour: new Date(date),
        priceNight: new Date(date)
    }
    const checkout={
        priceDay: new Date(date),
        priceHour: new Date(date),
        priceNight: new Date(date)
    }
   
   checkout.priceHour.setHours(date.getHours()+2);
    if(date.getHours()>22 || date.getHours()<6)
    {
      if(date.getHours()<6)
      {
        checkout.priceNight.setHours(12);
      }
      else
      {
       checkout.priceNight.setDate(date.getDate()+1);
        checkout.priceNight.setHours(12);
        checkout.priceNight.setSeconds(0);
        checkout.priceNight.setMinutes(0);
      }
    }
    else{
      checkout.priceNight.setDate(date.getDate()+1);
        checkout.priceNight.setHours(12);
        checkout.priceNight.setSeconds(0);
        checkout.priceNight.setMinutes(0);
    }
    if(date.getHours()> 16 && date.getHours()<22)
    {
        checkin.priceDay.setHours(22);
    } else if(date.getHours()<14) 
      {
        checkin.priceDay.setHours(14);
        checkin.priceDay.setMinutes(0)
      }
    checkout.priceDay.setDate(date.getDate()+1);
    checkout.priceDay.setHours(12);
    checkout.priceDay.setSeconds(0);
    checkout.priceDay.setMinutes(0);
    console.log(checkin)

    const filterlist =data?.roomTypes?.map((room)=>{
             let price= {
            priceDay: 0,
            priceNight:0,
            priceHour: 0
        }
           room.rentalPrices.map((rental)=>{
               price={...price, [getPriceKey(rental.type_rental)]: rental.price}
           })
         const rentalPrices= room.rentalPrices.map((rental)=>{
           if(room.bookings.length>0)
           {
          
            const isAvai=  room.bookings.filter((booking)=>{
                 if(booking.status=="cancelled") return false;
                 const checkout_time=new Date(booking.check_out_time || "");
                 console.log(checkout_time.getHours())
                checkout_time.setHours(checkout_time.getHours()+1);
                 const checkin_time=new Date(booking.start_date_time|| "");
                checkin_time.setHours(checkin_time.getHours()+1);
                console.log(checkout_time, checkin_time)
                if (booking.check_out_time)
                {
               if(checkin[getPriceKey(rental.type_rental)]>checkout_time) return false;
               if(checkout[getPriceKey(rental.type_rental)]< checkin_time) return false;
                }
            return true; 
            });
            if(isAvai.length>0) return {...rental, price: 0};
           }
          if(rental.type_rental === "priceDay") {
            console.log(checkin.priceDay.getHours())
                    if(checkin.priceDay.getHours()>22 || checkin.priceDay.getHours()<6)
                        return {...rental,price: price.priceNight }
          }
          if(rental.type_rental === "priceHour")
          {
            if(checkin.priceHour.getHours()+2> 22 || checkin.priceHour.getHours()+2<6)
            {
              return {...rental,price: price.priceNight, night:true}
            }
            else return {...rental, price: price.priceHour*5}
          }
          return rental;})
          console.log(rentalPrices)
        return {...room, rentalPrices:rentalPrices}
        }
        )
        
        return {success: true, data:{...data,roomTypes: filterlist}, checkin, checkout}
} catch(e){
        if(e instanceof Error)
        {
            return {success:false, message: e.message}
        }
    }

}