// src/index.ts
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.get("/health", (_, res) => res.send("OK"));

app.listen(4000, () => {
  console.log("🚀 Mock API running at http://localhost:4000");
});
