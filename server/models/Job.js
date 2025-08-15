import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
        required: true,
      },
    ],
    budget: {
      type: Number,
    },
    salary: {
      type: String,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [ 
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create text indexes for search
jobSchema.index({
  title: "text",
  description: "text",
  skills: "text",
  tags: "text",
});

// Create additional indexes for filtering
jobSchema.index({ location: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ tags: 1 });
jobSchema.index({ createdAt: -1 });

export default mongoose.model("job", jobSchema);
