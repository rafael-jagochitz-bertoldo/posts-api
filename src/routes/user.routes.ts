import { Router } from "express";
import { createUser, listAll, listOne } from "../controllers/user.controllers";

const userRouter = Router();

userRouter.post("/", createUser);
userRouter.get("/", listAll);
userRouter.get("/:id", listOne);

export default userRouter;
