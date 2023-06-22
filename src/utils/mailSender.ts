import nodemailer from "nodemailer";
import chalk from "chalk";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

export type MailSenderType = (
  email: string,
  title: string,
  body: string
) => Promise<SMTPTransport.SentMessageInfo | undefined>;

type CreateTransportOptionsType = {
  host?: string;
  auth?: {
    user?: string;
    pass?: string;
  };
};

type SendMailOptionsType = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export const mailSender: MailSenderType = async (email, title, body) => {
  try {
    const createTransportOptions: CreateTransportOptionsType = {
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    };
    const transporter = nodemailer.createTransport(createTransportOptions);

    const sendMailOptions: SendMailOptionsType = {
      from: "Excellence Academia || looneyD-ROHIT",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    };
    const info = await transporter.sendMail(sendMailOptions);

    return info;
  } catch (err: any) {
    console.error(chalk.red(err.message));
  }
};
