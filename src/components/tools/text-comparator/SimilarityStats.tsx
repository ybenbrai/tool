import * as React from "react";

interface SimilarityStatsProps {
  similarity: number;
  add: number;
  del: number;
  change: number;
}

export function SimilarityStats({
  similarity,
  add,
  del,
  change,
}: SimilarityStatsProps) {
  return (
    <div className="flex gap-6 items-center mb-4 text-sm">
      <span className="font-semibold">
        Similarity: {similarity.toFixed(1)}%
      </span>
      <span className="text-green-600">+{add} additions</span>
      <span className="text-red-600">-{del} deletions</span>
      <span className="text-yellow-600">~{change} changes</span>
    </div>
  );
}
