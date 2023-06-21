import express, { Router } from "express";
import { capturePayment, verifySignature } from "../controllers/Payments.js";
import { auth, isStudent, isInstructor, isAdmin } from "../middlewares/auth.js";

const router: Router = Router();

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifySignature", verifySignature);

export default router;
