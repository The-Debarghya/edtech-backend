import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
dotenv.config();

const connectionString: string = process.env.MONGODB_URL as string;

interface CustomMongooseOptions extends ConnectOptions {
  useNewUrlParser?: boolean;
  useUnifiedTopology?: boolean;
}

export const dbConnect = async () => {
  try {
    const options: CustomMongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(connectionString, options);
    console.log(chalk.yellow("DB Connection Established..."));
  } catch (err) {
    console.log(chalk.red.bold("DB Connection Failed..."));
    console.error(err);
    process.exit(1);
  }
};
