import express from "express";
import * as fs from "fs";
import morgan from "morgan";

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

const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json"));

// ROUTE HANDLERS

const getAllTours = (req, res) => {
  console.log(req.requstTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requstTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({ status: "fail", message: "invalid id" });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    "./dev-data/data/tours-simple.json",
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: "fail", message: "invalid id" });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "Updated tour",
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: "fail", message: "invalid id" });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};

// ROUTES

app.route("/api/v1/tours").get(getAllTours).post(createTour);
app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// SERVER INITIALISATION

const port = 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
