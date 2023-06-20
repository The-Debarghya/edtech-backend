import Razorpay from "razorpay";

export const razorpayInstance: Razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY as string,
  key_secret: process.env.RAZORPAY_SECRET as string,
});
