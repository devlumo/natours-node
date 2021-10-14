/* eslint-disable prefer-arrow-callback */
import mongoose from "mongoose";
import slugify from "slugify";
//import validator from "validator";

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
      maxlength: [40, "Name is too long 40 chars max"],
      minlength: [10, "Name must have more than 10 chars"],
      // validate: [validator.isAlpha, "Tour name must only contain A-Z"],
    },
    slug: {
      type: String,
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be 'easy', 'medium', or 'difficult'",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "rating must be between 1 and 5 (inclusive)"],
      max: [5, "rating must be between 1 and 5 (inclusive)"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // 'this' only references new document on documenrt create
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be lower than actual price",
      },
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual properties will note be stored in the DB and will just be available on get request
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: .pre() runs before .save() and .create() / .post() runs after with access to the doc
// the 'this' keyword will be bound to the document being processed
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milleseconds`);
  // console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE - add additional match stage to the pipeline before the query is executed
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});
const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
