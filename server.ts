import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postsRouter from "./routes/posts.js";
import dashboardRouter from "./routes/dashboard.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Social Intelligence API is running",
  });
});

app.use("/api/posts", postsRouter);
app.use("/api/dashboard", dashboardRouter);

async function startServer() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log("MongoDB connected");
    } else {
      console.log("MongoDB URI not configured");
    }

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
  }
}

startServer();