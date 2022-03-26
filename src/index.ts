import express, { NextFunction, Request, Response } from "express";
import AppError from "./errors/appError";
import routes from "./routes";

const app = express();

app.use(express.json());

app.use(routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.log(err);

  return res.status(500).json({ message: "internal server Error" });
});

export default app;
