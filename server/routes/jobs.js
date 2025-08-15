import express from "express";
import { body } from "express-validator";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.get("/", getAllJobs);
router.get("/:id", getJobById);

router.post(
  "/",
  authenticateToken,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("skills")
      .isArray({ min: 1 })
      .withMessage("At least one skill is required"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("tags").optional().isArray(),
  ],
  createJob
);

router.put(
  "/:id",
  authenticateToken,
  [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty"),
    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Description cannot be empty"),
    body("skills")
      .optional()
      .isArray({ min: 1 })
      .withMessage("At least one skill is required"),
    body("location")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Location cannot be empty"),
    body("tags").optional().isArray(),
  ],
  updateJob
);

router.delete("/:id", authenticateToken, deleteJob);

export default router;
