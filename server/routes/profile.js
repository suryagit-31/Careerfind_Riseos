import express from "express";
import multer from "multer";
import { body } from "express-validator";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  uploadFiles,
  connectWallet,
  disconnectWallet,
} from "../controllers/profilecontroller.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    console.log("file", file);
    if (file.fieldname === "resume") {
      cb(
        file.mimetype === "application/pdf"
          ? null
          : new Error("Resume must be a PDF"),
        true
      );
    } else if (file.fieldname === "avatar") {
      cb(
        file.mimetype.startsWith("image/")
          ? null
          : new Error("Avatar must be an image"),
        true
      );
    } else {
      cb(null, true);
    }
  },
});

// Routes
router.get("/", authenticateToken, getProfile);

router.put(
  "/",
  authenticateToken,
  [
    body("profile.bio").optional().isLength({ max: 500 }),
    body("profile.title").optional().isLength({ max: 100 }),
    body("profile.location").optional().isLength({ max: 100 }),
    body("profile.socialLinks.linkedin").optional({ checkFalsy: true }).isURL(),
    body("profile.socialLinks.github").optional({ checkFalsy: true }).isURL(),
  ],
  updateProfile
);

router.post(
  "/upload",
  authenticateToken,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  (req, res, next) => {
    console.log("Files received:", req.files);
    console.log("Body received:", req.body);
    next();
  },
  uploadFiles
);

router.post(
  "/connect-wallet",
  authenticateToken,
  [body("network").isIn(["ethereum", "solana"]), body("address").notEmpty()],
  connectWallet
);

router.post(
  "/disconnect-wallet",
  authenticateToken,
  [body("network").isIn(["ethereum", "solana", "polygon"])],
  disconnectWallet
);

export default router;
