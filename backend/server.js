import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import homeRoute from "./routes/homeRoute.js";
import userRoute from "./routes/userRoute.js";

dotenv.config({ path: "../.env" });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ubw_blog")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api", homeRoute);
app.use("/api/auth", userRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
