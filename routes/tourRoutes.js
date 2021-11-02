import express from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} from "../controllers/tourController.js";

const tourRouter = express.Router();

// tourRouter.param("id", checkId);

tourRouter.route("/top-5-cheap").get(aliasTopTours, getAllTours);
tourRouter.route("/tour-stats").get(getTourStats);
tourRouter.route("/get-monthly-plan/:year").get(getMonthlyPlan);
tourRouter.route("/").get(protect, getAllTours).post(createTour);

tourRouter
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

export default tourRouter;
