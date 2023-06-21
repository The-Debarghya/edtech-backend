import express, { Router } from "express";
import { capturePayment, verifySignature } from "../controllers/Payments.js";
import { auth, isStudent, isInstructor, isAdmin } from "../middlewares/auth.js";

const paymentsRouter: Router = Router();

paymentsRouter.post("/capturePayment", auth, isStudent, capturePayment);
paymentsRouter.post("/verifySignature", verifySignature);

export default paymentsRouter;
