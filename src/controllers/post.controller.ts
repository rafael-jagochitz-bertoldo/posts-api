import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import AppError from "../errors/appError";

const prisma = new PrismaClient();

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, body, userId } = req.body;

    const checkPost = await prisma.post.findUnique({ where: { title } });

    if (checkPost) {
      throw new AppError("post already exists");
    }

    const post = await prisma.post.create({
      data: {
        title,
        body,
        userId,
      },
    });

    const response = {
      id: post.id,
      title: post.title,
      body: post.body,
    };

    return res.status(201).send(response);
  } catch (err) {
    next(err);
  }
};

export const listAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await prisma.post.findMany();

    return res.send(posts);
  } catch (err) {
    next(err);
  }
};

export const listOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      throw new AppError("post not found", 404);
    }

    return res.send(post);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, body } = req.body;
    const { id } = req.params;

    if (!title || !body) {
      throw new AppError("invalid fields, please inform title or body");
    }

    const checkPost = await prisma.post.findUnique({ where: { title } });

    if (!checkPost) {
      throw new AppError("post not found", 404);
    }

    if (checkPost.title === title || checkPost.body === body) {
      return res
        .status(400)
        .send({ message: `can't update with the values is the same` });
    }

    const post = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title: title,
        body: body,
      },
    });

    return res.status(200).send(post);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const checkPost = await prisma.post.findUnique({ where: { id } });

    if (!checkPost) {
      throw new AppError("post not found", 404);
    }

    const deletedPost = await prisma.post.delete({
      where: {
        id,
      },
    });

    return res.status(204).send({});
  } catch (err) {
    next(err);
  }
};
