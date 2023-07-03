import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import { contactUsEmail } from "../mail/templates/contactFormRes.js";
import { mailSender } from "../utils/mailSender.js";
import { Request, Response } from "express";

type ContactUsControllerType = (
  req: Request,
  res: Response
) => Promise<Response<any, Record<string, any>>>;

export const contactUsController: ContactUsControllerType = async (
  req,
  res
) => {
  try {
    const {
      email,
      firstname,
      lastname,
      message,
      phoneNo,
      countrycode,
    }: {
      email: string;
      firstname: string;
      lastname: string;
      message: string;
      phoneNo: string;
      countrycode: string;
    } = req.body;
    console.log(req.body);

    const emailRes: SMTPTransport.SentMessageInfo | undefined =
      await mailSender(
        email,
        "Your Data send successfully",
        contactUsEmail(
          email,
          firstname,
          lastname,
          message,
          phoneNo,
          countrycode
        )
      );
    console.log("Email Res ", emailRes);
    return res.status(200).json({
      success: true,
      message: "Email send successfully",
    });
  } catch (error: any) {
    console.log("Error", error);
    console.log("Error message :", error.message);
    return res.json({
      success: false,
      message: "Something went wrong...",
    });
  }
};
