import express from "express";
import morgan from "morgan";
import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// MIDDLEWARES

app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  console.log("hello from middleware 👋");
  next();
});

app.use((req, res, next) => {
  req.requstTime = new Date().toISOString();
  next();
});

// ROUTES

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// SERVER INITIALISATION

export default app;
