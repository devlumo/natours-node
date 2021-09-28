import "./config.js";
import mongoose from "mongoose";
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

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
});

const Tour = mongoose.model("Tour", tourSchema);

const testTour = new Tour({
  name: "The Park Camper",
  rating: 4.7,
  price: 497,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log("Error when saving document: ", err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on http://127.0.0.1:${port}`);
});
