import { validationResult } from "express-validator";
import User from "../models/user.model.js";

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// Upload avatar/resume
export const uploadFiles = async (req, res) => {
  try {
    const updateData = {};

    if (req.files.avatar) {
      updateData["profile.avatar"] = `/uploads/${req.files.avatar[0].filename}`;
    }

    if (req.files.resume) {
      updateData["profile.resume"] = `/uploads/${req.files.resume[0].filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ message: "Server error uploading files" });
  }
};

// Connect wallet
export const connectWallet = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { network, address } = req.body;
    const updateData = {
      [`wallets.${network}.address`]: address,
      [`wallets.${network}.isConnected`]: true,
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("Error connecting wallet:", error);
    res.status(500).json({ message: "Server error connecting wallet" });
  }
};

// Disconnect wallet
export const disconnectWallet = async (req, res) => {
  try {
    const { network } = req.body;
    const updateData = {
      [`wallets.${network}.isConnected`]: false,
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("Error disconnecting wallet:", error);
    res.status(500).json({ message: "Server error disconnecting wallet" });
  }
};
