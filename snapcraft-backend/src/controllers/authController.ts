import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-super-secret-key-change-this"; // Add to .env

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;
  // Mock auth (replace with real DB/user check)
  if (username === "user" && password === "pass") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token, message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};

export const verifyToken = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    (req as any).user = decoded;
    next();
  });
};