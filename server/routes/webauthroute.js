import express from "express";
import { body } from "express-validator";
import {
  walletLogin,
  getWalletNonce,
} from "../controllers/webauthcontroller.js";

const router = express.Router();

// Wallet login
router.post(
  "/wallet-login",
  [
    body("address").notEmpty().withMessage("Wallet address is required"),
    body("signature").notEmpty().withMessage("Signature is required"),
    body("message").notEmpty().withMessage("Message is required"),
    body("network")
      .isIn(["ethereum", "solana", "polygon"])
      .withMessage("Invalid network"),
  ],
  walletLogin
);

// Get wallet nonce
router.post(
  "/wallet-nonce",
  [body("address").notEmpty().withMessage("Wallet address is required")],
  getWalletNonce
);

export default router;
