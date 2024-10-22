// src/actions/uploadImagesAction.ts
"use server";
import { cloudinary } from "./cloudinary";

export async function uploadImagesAction(files: File[], roomId: Number | undefined): Promise<string[]> {
  const uploadPromises = files.map((file) => {
    return new Promise<string>((resolve, reject) => {
      // Convert the File into a readable stream directly
      const stream = cloudinary.uploader.upload_stream(
        { folder: "image-hotel" }, // optional: specify a folder
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || "");
        }
      );

      // Convert the File object into a Node.js Readable stream
      const arrayBuffer = file.arrayBuffer();
      arrayBuffer.then((buffer) => {
        const url = stream.end(Buffer.from(buffer));
        console.log(url);
      }).catch(reject);
    });
  });
  // Await all uploads and return the array of URLs
  return await Promise.all(uploadPromises);
}
