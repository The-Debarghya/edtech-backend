import mongoose, { Document, Model, Schema, model } from "mongoose";
import chalk from "chalk";
import { mailSender } from "../utils/mailSender.js";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import { emailVerificationTemplate } from "../mail/templates/emailVerificationTemplate.js";

export interface OtpSchemaType extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new Schema<OtpSchemaType>({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now(),
    expires: 300,
    // TODO: document should automatically be deleted upon expiry
  },
});

// pre/post hook

type SendVerificationEmailType = (
  email: string,
  otp: string
) => Promise<undefined>;
const sendVerificationEmail: SendVerificationEmailType = async (email, otp) => {
  try {
    const mailResponse: SMTPTransport.SentMessageInfo | undefined =
      await mailSender(
        email,
        "Verification Email from StudyNotion",
        emailVerificationTemplate(otp)
      );
    console.log(chalk.green("Email sent successfully!!!"));
    console.log(mailResponse);
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    throw err;
  }
};

otpSchema.pre("save", async function (this: OtpSchemaType, next) {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

export const Otp: Model<OtpSchemaType> = model<OtpSchemaType>("Otp", otpSchema);
