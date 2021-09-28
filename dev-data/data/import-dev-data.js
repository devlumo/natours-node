import "../../config.js";
import mongoose from "mongoose";
import * as fs from "fs";
import Tour from "../../models/tourModel.js";

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

// READ JSON FILE

const tours = JSON.parse(
  fs.readFileSync("./dev-data/data/tours-simple.json", "utf-8")
);

// IMPORT DATA INTO DB

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// DELETE ALL DATA FROM COLLECTION

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("collection data cleared");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
}
if (process.argv[2] === "--delete") {
  deleteData();
}
