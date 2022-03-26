import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import AppError from "../errors/appError";

const prisma = new PrismaClient();

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, posts } = req.body;

  try {
    const checkUser = await prisma.user.findUnique({ where: { email } });

    if (checkUser) {
      throw new AppError("email already exists");
    }

    const hashedPass = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPass,
      },
    });

    const userPosts = await prisma.user.findFirst({
      where: {
        email,
      },
      include: { posts: true },
    });

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      posts: userPosts?.posts,
    };

    res.status(201).json(response);
  } catch (e) {
    next(e);
  }
};

export const listAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany({ include: { posts: true } });

    return res.send(users);
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

    const user = await prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });

    if (!user) {
      throw new AppError("user not found", 404);
    }

    return res.send(user);
  } catch (err) {
    next(err);
  }
};
