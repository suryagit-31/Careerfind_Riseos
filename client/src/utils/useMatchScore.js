// src/hooks/useMatchScore.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function useMatchScore({ jobId, userId }) {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get("/api/match-score", {
          params: { jobId, userId },
        });
        if (!cancelled) setScore(data.score);
      } catch (e) {
        if (!cancelled) setError("Could not compute match score");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (jobId && userId) run();
    return () => {
      cancelled = true;
    };
  }, [jobId, userId]);

  return { score, loading, error };
}
