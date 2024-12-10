import rateLimit from "express-rate-limit";
import authController from "../controllers/authController.js";
import express from "express";
const authRouter = express.Router();

//ip limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
})

authRouter.post('/register', limiter, authController.register);
authRouter.post('/login', limiter, authController.login);

export default authRouter;