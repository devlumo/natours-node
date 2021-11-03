import express from "express";
import morgan from "morgan";
import path from "path";
// import cors from "cors";

import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";

import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";

const __dirname = path.resolve();

const app = express();

// MIDDLEWARES

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// app.use(
//   cors({
//     origin: "http://localhost:3001",
//   })
// );
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// ERROR Handling middleware

app.use(globalErrorHandler);

export default app;
