import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token Provided " });
    return;
  }

  try {
    let decoded = jsonwebtoken.verify(token, "wrong-secret");
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};

export default verifyToken;
