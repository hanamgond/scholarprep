// src/routes/auth.routes.ts
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { users } from "../data/users";

const router = Router();
const JWT_SECRET = "mock-secret";

router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
      permissions: user.permissions,
    },
    JWT_SECRET,
    { expiresIn: "1h" },
  );

  return res.json({
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      tenantId: user.tenantId,
      campusId: user.campusId,
      role: user.role,
      permissions: user.permissions,
    },
  });
});

export default router;
