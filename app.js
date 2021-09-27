import express from "express";
import morgan from "morgan";
import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";
import path from "path";
const __dirname = path.resolve();

const app = express();

// MIDDLEWARES

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

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

export default app;
