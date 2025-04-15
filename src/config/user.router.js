import express from "express";
import UserController from "./users.controller.js";
import { jwtAuthGuard } from "../../middleware/jwt.middleware.js";
const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/", jwtAuthGuard, (req, res, next) => {
  userController.get(req, res, next);
});

userRouter.get("/set-new-password/:token", (req, res, next) => {
  userController.setNewPassword(req, res, next);
});

userRouter.post("/reset-password/:token", (req, res, next) => {
  userController.resetPassword(req, res, next);
});

userRouter.post("/register", (req, res, next) => {
  userController.register(req, res, next);
});

userRouter.post("/login", (req, res, next) => {
  userController.login(req, res, next);
});

userRouter.post("/forgot-password", (req, res, next) => {
  userController.forgotPassword(req, res, next);
});
export default userRouter;
