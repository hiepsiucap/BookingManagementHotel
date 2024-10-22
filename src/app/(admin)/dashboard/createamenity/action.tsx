/** @format */
"use server";
import { db } from "@/app/lib/db";
import { uploadAmenityToCloudinary } from "../../../../../utils/uploadAmenity";
import { error } from "console";
export async function handleSubmit(formData: FormData) {
  // Đánh dấu hàm này là server action
  const description = formData.get("description") as string;
  const file = formData.get("image") as File;
  if (!file) return { error: true, message: "Can't find the file" };
  const fileBuffer = await file.arrayBuffer();
  const mimeType = file.type;
  const encoding = "base64";
  const base64Data = Buffer.from(fileBuffer).toString("base64");
  const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;
  const res = await uploadAmenityToCloudinary(fileUri, file.name);
  let image = "";
  if (res.success == true) {
    image = res.result.url;
  } else return;
  const amenity = await db.amenity.create({
    data: {
      description,
      image,
    },
  });
  return { error: false, message: "Create A Amenity " };
}
