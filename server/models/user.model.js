import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    wallets: {
      ethereum: {
        address: String,
        isConnected: { type: Boolean, default: false },
      },
    },
    authMethod: {
      type: String,
      enum: ["email", "wallet"],
      default: "email",
    },
    // Profile Information
    profile: {
      bio: String,
      title: String,
      location: String,
      experience: String,
      education: String,
      avatar: String,
      resume: String,
      skills: [
        {
          name: String,
          level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
            default: "Intermediate",
          },
          yearsOfExperience: Number,
        },
      ],
      socialLinks: {
        linkedin: String,
        github: String,
      },
      preferences: {
        jobTypes: [String],
        salaryRange: {
          min: Number,
          max: Number,
        },
        remoteWork: { type: Boolean, default: false },
        availableForWork: { type: Boolean, default: true },
      },
    },
    // Web3 specific data
    web3Data: {
      nftCollections: [String],
      tokenBalances: [
        {
          token: String,
          balance: String,
          network: String,
        },
      ],
      transactions: [
        {
          hash: String,
          network: String,
          timestamp: Date,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
