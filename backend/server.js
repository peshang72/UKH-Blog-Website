import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import homeRoute from "./routes/homeRoute.js";

dotenv.config();

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/", homeRoute);

export default app;