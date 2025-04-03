import { config } from "dotenv";
config({
  path: "./config/config.env",
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary"; // Corrected import
import fileUpload from "express-fileupload";
import { connection } from "./DATABASE/connetion.js";
import { errorMiddleWare } from "./middlewares/error.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary configuration set:", process.env.CLOUDINARY_CLOUD_NAME);

// Middleware Setup
app.use(
  cors({
    origin: [process.env.FRONTEND_URL], // Fixed typo in FRONTEND_URL
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/", // Temporary directory for file uploads
  })
);

// Define Routes
app.use("/api/v1/user", userRouter);

// Connect to Database
connection();

// Error Middleware (should be placed after all routes)
app.use(errorMiddleWare);

// Start Server
app.listen(process.env.PORT, () => {
  try {
    console.log(`Server is listening on Port No. ${process.env.PORT}`);
  } catch (error) {
    console.error("Error starting the server:", error);
  }
});

export default app;
