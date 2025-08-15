// e.g., JobDetail.jsx
import useMatchScore from "../hooks/useMatchScore";
import MatchScoreBadge from "../components/Matchscorebadge";
import { useAuthStore } from "../store/authStore";

export default function JobDetail({ job }) {
  const { user } = useAuthStore();
  const { score, loading, error } = useMatchScore({
    jobId: job._id,
    userId: user._id,
  });

  return (
    <div className="space-y-4">
      {/* job content... */}
      {loading && (
        <p className="text-sm text-neutral-500">Scoring your match…</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && <MatchScoreBadge score={score} />}
    </div>
  );
}
