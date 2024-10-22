"use server"
import { db } from "@/app/lib/db";
interface ListPrice {
    isAvai: boolean;
    id: number;
    price: number 
}
export const CheckAvaRoom =async (formData: FormData) : Promise<{ checkout_date: Date, listprice: ListPrice[]} | undefined>=> {
   
    const startHour= formData.get("startHour") as string;
    const startDate= formData.get("Date") as string ;
    const returnDate= formData.get("returnDate") as string ;
    const checkin_date= new Date(startDate)
    const checkout_date= new Date(returnDate);
    const numbDay= formData.get("numbDay");
    const numbHour= formData.get("numbHour");
    const TypeRent= formData.get("TypeRent");
    console.log(TypeRent, startHour)
    const id= formData.get("id");
    console.log(startDate, returnDate);
    const diffInMilliseconds = checkout_date.getTime() - checkin_date.getTime();
    try{
const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
console.log(diffInHours);
    const listroom=  await db.roomTypes.findMany({
         where:{
            hotel_id:Number(id)
         },
         include: {
                    rentalPrices: true,
                    bookings: true,
            }
         }
    )
    const filterlist =listroom.map((room)=>{
           if(room.bookings.length>0)
           {
        
            const isAvai=  room.bookings.filter((booking)=>{
                if(booking.status ==="cancelled" || booking.status ==="check_out") return false;
                const checkout_time=new Date(booking.check_out_time || "");
                checkout_time.setHours(checkout_time.getHours()+1);
                 const checkin_time=new Date(booking.start_date_time|| "");
                checkin_time.setHours(checkout_time.getHours()+1);
                if (booking.check_out_time)
                {
               if(checkin_date> checkout_time) return false;
               if(checkout_date< checkin_date) return false;
                }
            return true 
            });
            if(isAvai.length>0) return {isAvai: false ,id:room.id, price: 0};
           }
           let price= {
            priceHour: 0,
            priceNight: 0,
            priceDay: 0,
           }
           room.rentalPrices.forEach((rental)=>{
              price={...price,[rental.type_rental]:rental.price }
           })
           console.log(price);
           if(TypeRent=="priceHour")
           {
              if(Number(startHour)< 22 &&Number(startHour) +Number(numbHour)> 22) return {isAvai: true,id: room.id, price: price?.priceNight+price?.priceHour*(Math.ceil(Number(startHour) +Number(numbHour)- 22))}
             else if(Number(startHour)> 22 || Number(startHour)<6 )
                { 
                    if((Number(numbHour)+ Number(startHour)%24)>12 && Number(startHour)<22) return {isAvai: true,id:room.id, price: price?.priceNight+price.priceHour*(Math.ceil(Number(numbHour)+ Number(startHour)-12))}
                    return {isAvai: true, id:room.id, price: price?.priceNight}
                }
              return {isAvai: true, id:room.id, price: price?.priceHour*(Number(numbHour)+3)}
           }
           if(TypeRent =="priceNight")
           {
            if(Number(startHour)<22 && Number(startHour)>14)
            return {isAvai: true ,id:room.id, price: (Math.ceil(22-Number(startHour)))*price.priceHour+price.priceNight}
             
            return {isAvai: true ,id:room.id, price:price.priceNight}
           }
           console.log(TypeRent)
           if(TypeRent =='priceDay')
           {
            
            console.log(Number(startHour))
             if(Number(startHour)>22|| Number(startHour)<6) return {isAvai: true ,id:room.id, price: price.priceNight+price.priceDay* (Number(numbDay)-1)}
            if(Number(startHour)<14)  return {isAvai: true ,id:room.id, price: (Math.ceil(14-Number(startHour)))*price.priceHour+price.priceDay* Number(numbDay)}
            return {isAvai: true ,id:room.id, price:price.priceDay* (Number(numbDay))}}
            return {isAvai: true ,id:room.id, price:1};
           }
        )
    return {checkout_date:checkout_date, listprice:filterlist};}catch (e){
       console.log(e);
    }

}