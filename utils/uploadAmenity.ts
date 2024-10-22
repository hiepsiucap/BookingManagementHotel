/** @format */
import { cloudinary } from "./cloudinary";
import { NextRequest } from "next/server";

type UploadResponse =
  | { success: true; result?: any }
  | { success: false; error: any };

export const uploadAmenityToCloudinary = (
  fileUri: string,
  fileName: string
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        resource_type: "auto",
        filename_override: fileName,
        folder: "amenity-images", // any sub-folder name in your cloud
        use_filename: true,
      })
      .then((result) => {
        resolve({ success: true, result });
      })
      .catch((error) => {
        reject({ success: false, error });
      });
  });
};
