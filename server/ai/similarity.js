
export function cosineSimilarity(a, b) {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function toPercent(sim) {
  // sim in [-1, 1] → [0, 100]
  const pct = Math.max(0, Math.min(1, (sim + 1) / 2)) * 100;
  return Math.round(pct);
}
