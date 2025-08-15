import Job from "../models/Job.js";
import { validationResult } from "express-validator";

// @desc Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, skills, location, tags } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (location) query.location = { $regex: location, $options: "i" };
    if (skills) query.skills = { $in: skills.split(",").map((s) => s.trim()) };
    if (tags) query.tags = { $in: tags.split(",").map((t) => t.trim()) };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };
    const skip = (options.page - 1) * options.limit;

    const jobs = await Job.find(query)
      .populate("author", "name email")
      .sort(options.sort)
      .skip(skip)
      .limit(options.limit);

    const total = await Job.countDocuments(query);
    const totalPages = Math.ceil(total / options.limit);
    const hasMore = options.page < totalPages;

    res.json({
      jobs,
      pagination: {
        currentPage: options.page,
        totalPages,
        hasMore,
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error fetching jobs" });
  }
};

// @desc Get single job
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "author",
      "name email"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Server error fetching job" });
  }
};

// @desc Create job
export const createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }

    const jobData = { ...req.body, author: req.user._id };
    const job = new Job(jobData);
    await job.save();
    await job.populate("author", "name email");

    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Server error creating job" });
  }
};

// @desc Update job
export const updateJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("author", "name email");

    res.json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Server error updating job" });
  }
};

// @desc Delete job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Server error deleting job" });
  }
};
