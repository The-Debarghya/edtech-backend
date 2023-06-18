import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
dotenv.config();

const connectionString: string = process.env.MONGODB_URL as string;

export const dbConnect = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log(chalk.yellow("DB Connection Established..."));
    } catch (err) {
        console.log(chalk.red.bold("DB Connection Failed..."));
        console.error(err);
        process.exit(1);
    }
};
