"use server"
import { uploadToCloudinary } from "../../../../../utils/uploadToMainImage";
import { handleImageCreation } from "@/action/CreateImage";
export const CreateImageAction =async (FD: FormData)=>{
          
          const file = FD.get("image") as File;
          const roomId= FD.get("room_id");
          const fileBuffer = await file.arrayBuffer();
          const mimeType = file.type;
          const encoding = "base64";
          const base64Data = Buffer.from(fileBuffer).toString("base64");
          try
          {
          const fileUri =
            "data:" + mimeType + ";" + encoding + "," + base64Data;
          const res = await uploadToCloudinary(fileUri, file.name);
          if(!res.success) throw new Error("False to UpLoad Image");
          console.log(res);
          let image = "";
          if (res.success == true && roomId) {
            image = res.result.url;
            const formData = new FormData();
            formData.set("room_type_id",roomId);
            formData.set("image_link", image);
           const response= await handleImageCreation(formData);
           if(!response.success) throw new Error("False To Create Image");
           return {success: true ,message: "Success Upload Image"}
          }}
          catch(error)
          {
             return {success: false, message: "Fall To Create Image"};
          }
}