import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import pLimit from "p-limit";
dotenv.config();

import { CloudinaryStorage } from "multer-storage-cloudinary";

const multerStorage = (folderName: string) =>
  new CloudinaryStorage({
    cloudinary,
    params: async (req: any, file: any) => {
      return {
        folder: folderName,
        format: "jpeg",
        allowed_formats: ["jpg"],
      };
    },
  });


export const upload = (folderName: string) =>
  multer({ storage: multerStorage(folderName) });

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
  secure: true,
});
const limit = pLimit(10);

export const cloudinaryImageUploadMethod = async (file: any) => {
  return new Promise((resolve) => {
    return limit(async () => {
      cloudinary.uploader.upload(file, (_err: any, res: any) => {
        resolve({
          limits: {
            fileSize: 1024 * 1024 * 5,
          },
          allowedFormats: ["jpg"],

          res: res.secure_url,
        });
      });
    });
  });
};
