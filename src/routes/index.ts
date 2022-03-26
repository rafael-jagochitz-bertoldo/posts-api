import { Router } from "express";
import postRouter from "./post.routes";
import userRouter from "./user.routes";

const routes = Router();

routes.use("/user", userRouter);
routes.use("/post", postRouter);

export default routes;
