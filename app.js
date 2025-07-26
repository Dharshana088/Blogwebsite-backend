import express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/users.js";
import blogRoutes from "./routes/blogs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path?.dirname?.(__filename);  

const app = express();

app.use(cors({
  origin: process?.env?.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express?.json?.({ limit: "10kb" })); 
app.use('/uploads', express?.static?.(path?.join?.(__dirname, 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => {
  res?.status?.(200)?.json?.({ 
    status: "success",
    message: " Blog website is running",
    timestamp: new Date() 
  });
});

app.use((req, res) => {
  res?.status?.(404)?.json?.({ 
    status: "fail",
    message: `Route ${req?.originalUrl} not found` 
  });
});

app.use((err, req, res, next) => {
  console?.error?.("Error:", err?.message);
  res?.status?.(err?.statusCode || 500)?.json?.({
    status: "error",
    message: err?.message || "Internal server error",
    ...( { stack: err?.stack })
  });
});

export default app;
