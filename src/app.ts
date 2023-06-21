import express, { Express } from "express";
import cors from "cors";
import courseRouter from "./routes/Course.js";
import paymentsRouter from "./routes/Payments.js";
import profileRouter from "./routes/Profile.js";
import userRouter from "./routes/User.js";
import { dbConnect } from "./config/database.js";
import cookieParser from "cookie-parser";
import { cloudinaryConnect } from "./config/cloudinary.js";
import fileUpload from "express-fileupload";
import chalk from "chalk";
import dotenv from "dotenv";

// environment variables
dotenv.config();

// app instance
const app: Express = express();

// handling json data in requests
app.use(express.json());

// cookie parser
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: "http://localhost:5173",
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
