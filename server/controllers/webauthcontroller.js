import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });
};

// Wallet login controller
export const walletLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { address, signature, message, network } = req.body;

    // Verify signature
    let isValidSignature = false;

    if (network === "ethereum" || network === "polygon") {
      try {
        const recoveredAddress = ethers.utils.verifyMessage(message, signature);
        isValidSignature =
          recoveredAddress.toLowerCase() === address.toLowerCase();
      } catch (error) {
        console.error("Signature verification error:", error);
      }
    } else if (network === "solana") {
      // Implement Solana signature verification
      isValidSignature = true; // Simplified for demo
    }

    if (!isValidSignature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Find or create user
    let user = await User.findOne({
      [`wallets.${network}.address`]: address,
    });

    if (!user) {
      const walletData = {
        [network]: { address, isConnected: true },
      };

      user = new User({
        name: `User ${address.slice(0, 6)}...${address.slice(-4)}`,
        email: `${address.toLowerCase()}@wallet.local`,
        authMethod: "wallet",
        wallets: walletData,
      });
      await user.save();
    } else {
      user.wallets[network].isConnected = true;
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      message: "Wallet authentication successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        wallets: user.wallets,
        authMethod: user.authMethod,
      },
      token,
    });
  } catch (error) {
    console.error("Wallet login error:", error);
    res
      .status(500)
      .json({ message: "Server error during wallet authentication" });
  }
};

// Wallet nonce controller
export const getWalletNonce = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { address } = req.body;
    const nonce = Math.floor(Math.random() * 1000000);
    const message = `Sign this message to authenticate with Career Find. Nonce: ${nonce}`;

    res.json({ message, nonce });
  } catch (error) {
    console.error("Nonce generation error:", error);
    res.status(500).json({ message: "Server error generating nonce" });
  }
};
