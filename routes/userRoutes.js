import express from "express";
import { login, signUp } from "../controllers/authController.js";

import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
