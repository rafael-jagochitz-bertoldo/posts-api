import { Router } from "express";
import {
  createPost,
  deletePost,
  listAll,
  listOne,
  updatePost,
} from "../controllers/post.controller";

const postRouter = Router();

postRouter.post("/", createPost);
postRouter.get("/", listAll);
postRouter.get("/:id", listOne);
postRouter.patch("/:id", updatePost);
postRouter.delete("/:id", deletePost);

export default postRouter;
