import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import cookieParser from "cookie-parser";
import profileRoutes from "./routes/profile.js";
import web3AuthRoutes from "./routes/webauthroute.js";
import matchRoutes from "./routes/match.route.js";

import path from "path";

dotenv.config();

const app = express();

app.use(cookieParser());
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/web3", web3AuthRoutes);
app.use("/api", matchRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});
// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://suryadammalapa:wajWWphveFqeXz2Q@careerfinder.zgjx3mw.mongodb.net/Carrerfind"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

export default app;
