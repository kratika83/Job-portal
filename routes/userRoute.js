import userController from "../controllers/userController.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
const userRouter = express.Router();

userRouter.put(
    '/update-user',
    authMiddleware.userAuth,
    userController.updateUser
);

export default userRouter;