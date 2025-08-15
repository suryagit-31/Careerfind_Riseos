import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { getMatchScore } from "../controllers/match.controller.js";

const router = express.Router();

router.get("/match-score", authenticateToken, getMatchScore);
// or router.post("/match-score", authenticateToken, getMatchScore);

export default router;
