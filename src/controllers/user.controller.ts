import { Request, Response, NextFunction } from "express";

export const user = (req: Request, res: Response) => {
  res.send("user!");
};
