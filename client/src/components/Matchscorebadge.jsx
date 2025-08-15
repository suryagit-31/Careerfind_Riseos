// src/components/MatchScoreBadge.jsx
export default function MatchScoreBadge({ score }) {
  if (score == null) return null;

  let color = "bg-red-500";
  if (score >= 80) color = "bg-green-600";
  else if (score >= 60) color = "bg-yellow-500";
  else if (score >= 40) color = "bg-orange-500";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-neutral-600">Match Score</span>
        <span className="font-medium">{score}%</span>
      </div>
      <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div className={`${color} h-2`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
