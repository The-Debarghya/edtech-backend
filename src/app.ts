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
import logger from "morgan";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import credentials from "./middlewares/credentials.js";
import corsOptions from "./config/corsOptions.js";

// environment variables
dotenv.config();

// app instance
const app: Express = express();

// middleware to prevent browser caching always
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// middleware for logging purposes
app.use(logger("tiny"));

// Use Helmet!
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      // Specify the CSP directives here
      // ...
      // Add the necessary directive to allow the image URL
      "img-src": ["'self'", "res.cloudinary.com", "data:"],
    },
  })
);

// middleware for Access Control Allow Origin, to be called before cors
app.use(credentials);

// cors (not required if serving statically)
app.use(cors());

// handling json data in requests
app.use(express.json());

// middleware to handle incoming url encoded form data
app.use(express.urlencoded({ extended: false }));

// cookie parser
app.use(cookieParser());

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

// serving as static files (get rid of cors)
// const filePath = fileURLToPath(import.meta.url);
// const directoryPath = dirname(filePath);
// console.log(path.resolve(directoryPath, "frontend", "build"));
// app.use(express.static(path.join(directoryPath, "frontend", "build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(directoryPath, "frontend", "build", "index.html"));
// });

// default route (use only in development)
app.all("*", (req, res) => {
  // return res
  //   .status(200)
  //   .sendFile(path.resolve(directoryPath, "frontend", "build", "index.html"));
  return res.status(200).json({
    success: true,
    message: "Server is up and running...",
  });
});

// listen on a port
app.listen(PORT, () => {
  console.log(`App started on: ` + chalk.blue.bold(`http://localhost:${PORT}`));
});
