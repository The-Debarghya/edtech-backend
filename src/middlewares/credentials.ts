import allowedOrigins from "../config/allowedOrigins.js";
import { NextFunction, Request, Response } from "express";

type CredentialsFunctionType = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

const credentials: CredentialsFunctionType = (req, res, next) => {
  if (allowedOrigins.includes(req.headers?.origin as string)) {
    // allowings the Access Control Allow Credentials --> to expose response data to
    // frontend js
    console.log(req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    // res.header('Access-Control-Allow-Origin', 'https://admin.socket.io');
  }
  next();
};

export default credentials;
