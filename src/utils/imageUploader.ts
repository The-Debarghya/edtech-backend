import cloudinary, { UploadApiOptions, UploadApiResponse } from "cloudinary";
import fileUpload from "express-fileupload";

export type FileType = fileUpload.UploadedFile;

type CloudinaryUploadFunctionType = (
  file: FileType,
  folder: string,
  height?: string | number | undefined,
  quality?: number | string | undefined
) => Promise<UploadApiResponse>;

export const uploadImageToCloudinary: CloudinaryUploadFunctionType = async (
  file,
  folder,
  height = 100,
  quality = 100
) => {
  const options: UploadApiOptions = {
    folder,
    height,
    quality,
    resource_type: "auto",
  };

  const response: UploadApiResponse = await cloudinary.v2.uploader.upload(
    file.tempFilePath,
    options
  );
  return response;
};
