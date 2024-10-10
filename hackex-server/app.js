/* eslint-disable import/no-extraneous-dependencies */
// const path = require("path");
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const AppError = require("./utils/appError");
const userRouter = require("./routes/userRoutes");
const problemRouter = require("./routes/problemRoutes");
const contestRouter = require("./routes/contestRouter");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*", // Your frontend URL
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));

app.use(helmet({ contentSecurityPolicy: false }));

const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 10000,
  message: "Too many requests from this IP. Please try again later.",
});

app.use("/api", limiter);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "uploads/profileImages");
    fs.mkdirSync(dir, { recursive: true }); // Ensure the directory exists
    cb(null, dir); // Set destination folder for uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Set filename
  },
});

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(mongoSanitize());

app.use(xss());
app.use(compression());

// Routes

app.use("/api/v1/users", userRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/contests", contestRouter);

app.all("*", (req, res, next) => {
  const err = new AppError(`Can't find ${req.url} on the server.`, 404);
  next(err);
});

module.exports = app;
