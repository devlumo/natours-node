import express from "express";
import morgan from "morgan";
import path from "path";

import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";

const __dirname = path.resolve();

const app = express();

// MIDDLEWARES

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

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
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server.`,
  });
});

export default app;
