/** @format */
"use server";
import { db } from "@/app/lib/db";
import { uploadToCloudinary } from "../../../../../utils/uploadToMainImage";
export async function handleSubmit(formData: FormData) {
  // Đánh dấu hàm này là server action
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    address
  )}&apiKey=${process.env.LOCATION_URL}`;
  const file = formData.get("mainimage") as File;
  if (!file) return;
  const fileBuffer = await file.arrayBuffer();

  const mimeType = file.type;
  const encoding = "base64";
  const base64Data = Buffer.from(fileBuffer).toString("base64");

  // this will be used to upload the file
  const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;
  const res = await uploadToCloudinary(fileUri, file.name);
  let image = "";
  if (res.success == true) {
    image = res.result.url;
  } else return;
  const data = await fetch(url);
  if (data.ok) {
    const result = await data.json();
    const latitude = result.features[0].geometry.coordinates[0];
    const longitude = result.features[0].geometry.coordinates[1];
    const hotel = await db.hotel.create({
      data: {
        name,
        address,
        city,
        latitude,
        longitude,
        mainimage: image,
      },
    });
  }
  // Xử lý dữ liệu (ví dụ: lưu vào database)
}
