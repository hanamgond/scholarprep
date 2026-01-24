// src/routes/user.routes.ts
import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { users } from "../data/users";

const router = Router();

router.get("/me", authMiddleware, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = users.find((u) => u.id === req.user!.userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({
    id: user.id,
    email: user.email,
    tenantId: user.tenantId,
    campusId: user.campusId,
    role: user.role,
    permissions: user.permissions,
  });
});

export default router;
