import express, { Express } from "express";
import cors from "cors";
import courseRouter from "./routes/Course.js";
import paymentsRouter from "./routes/Payments.js";
import contactUsRouter from "./routes/Contact.js";
import profileRouter from "./routes/Profile.js";
import userRouter from "./routes/User.js";
import { dbConnect } from "./config/database.js";
import cookieParser from "cookie-parser";
import { cloudinaryConnect } from "./config/cloudinary.js";
import fileUpload from "express-fileupload";
import chalk from "chalk";
import helmet from "helmet";
import dotenv from "dotenv";

// environment variables
dotenv.config();

// app instance
const app: Express = express();

// Use Helmet!
app.use(helmet());

// handling json data in requests
app.use(express.json());

// cookie parser
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: [
      "https://excellence-academia-git-main-looneyd-rohit.vercel.app/",
      "https://excellence-academia-2q0ukte5r-looneyd-rohit.vercel.app/",
      "http://excellence-academia.vercel.app/",
      "https://excellence-academia-git-main-looneyd-rohit.vercel.app",
      "https://excellence-academia-2q0ukte5r-looneyd-rohit.vercel.app",
      "http://excellence-academia.vercel.app",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    credentials: true,
  })
);

// express file upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

const PORT = process.env.PORT || 4000;

// connect to database
dbConnect();

// connect to cloudinary
cloudinaryConnect();

// routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/payment", paymentsRouter);
app.use("/api/v1/reach", contactUsRouter);

// default route
app.all("*", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is up and running...",
  });
});

// listen on a port
app.listen(PORT, () => {
  console.log(`App started on: ` + chalk.blue.bold(`http://localhost:${PORT}`));
});
