import cloudinary from "cloudinary";

type CloudinaryConnectFunctionType = () => void;

export const cloudinaryConnect: CloudinaryConnectFunctionType = () => {
  try {
    cloudinary.v2.config({
      // Configuring the Cloudinary to Upload MEDIA
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  } catch (error) {
    console.log(error);
  }
};
