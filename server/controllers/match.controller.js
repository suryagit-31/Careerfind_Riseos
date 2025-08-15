import { embedText } from "../ai/embedding.js";
import { cosineSimilarity, toPercent } from "../ai/similarity.js";
import Job from "../models/Job.js";
import User from "../models/user.model.js";

function buildTextFromJob(job) {
  const parts = [
    job.title ?? "",
    job.description ?? "",
    (job.skills || []).join(", "),
  ];
  return parts.join("\n");
}

function buildTextFromUser(user) {
  const p = user.profile || {};
  const parts = [
    p.title ?? "",
    p.bio ?? "",
    (p.skills || []).join(", "), // if you store skills on user; otherwise skip
  ];
  return parts.join("\n");
}

export async function getMatchScore(req, res) {
  try {
    const { jobId, userId } = req.query;

    if (!jobId || !userId) {
      return res.status(400).json({ message: "jobId and userId are required" });
    }

    const [job, user] = await Promise.all([
      Job.findById(jobId),
      User.findById(userId),
    ]);

    if (!job || !user) {
      return res.status(404).json({ message: "Job or User not found" });
    }

    const jobText = buildTextFromJob(job);
    const userText = buildTextFromUser(user);

    // Make embeddings (1–2ms after warm-up; first call downloads the model)
    const [jobVec, userVec] = await Promise.all([
      embedText(jobText),
      embedText(userText),
    ]);

    const sim = cosineSimilarity(jobVec, userVec);
    const score = toPercent(sim); // 0–100

    return res.json({ score, similarity: sim });
  } catch (err) {
    console.error("match-score error:", err);
    return res.status(500).json({ message: "Failed to compute match score" });
  }
}
