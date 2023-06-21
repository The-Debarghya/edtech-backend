import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

export const razorpayInstance: Razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY as string,
  key_secret: process.env.RAZORPAY_SECRET as string,
});
