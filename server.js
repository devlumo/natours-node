import "./config.js";
import mongoose from "mongoose";
import "./utils/exceptionHandler.js";
import app from "./app.js";

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(
    `App running on http://127.0.0.1:${port}, ENV: ${process.env.NODE_ENV}`
  );
});

// Handling promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! App shutdown!");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
