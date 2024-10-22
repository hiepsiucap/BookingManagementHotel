"use server"
import {z} from "zod"
import { db } from "@/app/lib/db"
export const CreatePrice = async (formdata: FormData)=> {
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
    const price: { priceDay: string; priceNight: string; priceHour: string } ={
     priceDay :formdata.get("price_day") as string,
     priceNight :formdata.get("price_night") as string,
     priceHour :formdata.get("price_hour") as string
    }
     const rooomId= formdata.get("room_id");
     console.log(rooomId)
     try
     {
    const res=await db.rentalPrice.findMany({
        where: {
            room_type_id: Number(rooomId)
        }
    })
    if(res?.length>0)
    {
        const newPromises= res.map(async(pr)=>{
           return await db.rentalPrice.update({
  where: {
    id: pr.id
  },
  data: {
    type_rental: pr.type_rental,
    price: Number(price[getPriceKey(pr.type_rental)]),
  },
});
        })
          await Promise.all(newPromises);
        return {success: true , message: "Cập nhật giá thành công"}
      
    } else
    {
       const NewPromise= Object.keys(price).map(async(key) => {
           const value = price[key as keyof typeof price]; 
          return  await db.rentalPrice.create({
            data:{
                type_rental: key,
                price: Number(value),
                room_type_id: Number(rooomId),
            }
           })
      
});
     const data = await Promise.all(NewPromise);
     console.log(data)
    return {success: true , message: "Tạo giá thành công"}
    }
} catch (e){
       if(e instanceof Error)
       return {success: false, message: e.message }
    }
   
}