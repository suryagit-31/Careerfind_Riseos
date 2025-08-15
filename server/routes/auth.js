import express from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/user.model.js";
import { signup, logout, login } from "../controllers/authcontroller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/register", signup);
router.post("/logout", logout);
router.post("/login", login);

export default router;
