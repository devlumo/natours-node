import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "Duration is required"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "Tour size is required"],
  },
  difficulty: {
    type: String,
    required: [true, "Difficulty is required"],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, "Tour needs a summary"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "Tour needs an image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
