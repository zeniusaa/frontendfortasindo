export const healthStatuses = [
  { key: "excellent", label: "Excellent", min: 90, color: "#22c55e", darkColor: "#15803d", textClass: "text-green-600 dark:text-green-400", badgeClass: "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300", panelClass: "border-green-500/35 bg-green-500/[0.06]", dotClass: "bg-green-500" },
  { key: "good", label: "Good", min: 80, color: "#06b6d4", darkColor: "#0e7490", textClass: "text-cyan-600 dark:text-cyan-400", badgeClass: "bg-cyan-500/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-300", panelClass: "border-cyan-500/35 bg-cyan-500/[0.06]", dotClass: "bg-cyan-500" },
  { key: "fair", label: "Fair", min: 70, color: "#eab308", darkColor: "#a16207", textClass: "text-yellow-600 dark:text-yellow-400", badgeClass: "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-300", panelClass: "border-yellow-500/35 bg-yellow-500/[0.06]", dotClass: "bg-yellow-500" },
  { key: "poor", label: "Poor", min: 60, color: "#f97316", darkColor: "#c2410c", textClass: "text-orange-600 dark:text-orange-400", badgeClass: "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-300", panelClass: "border-orange-500/35 bg-orange-500/[0.06]", dotClass: "bg-orange-500" },
  { key: "critical", label: "Critical", min: 0, color: "#ef4444", darkColor: "#b91c1c", textClass: "text-rose-600 dark:text-rose-400", badgeClass: "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300", panelClass: "border-rose-500/35 bg-rose-500/[0.06]", dotClass: "bg-rose-500" },
];

export function getHealthStatus(score) {
  if (score == null || Number.isNaN(Number(score))) return null;
  return healthStatuses.find((status) => Number(score) >= status.min) || healthStatuses.at(-1);
}

export function getHealthDistribution(scores = []) {
  const counts = Object.fromEntries(healthStatuses.map((status) => [status.key, 0]));
  let noData = 0;
  scores.forEach((score) => {
    const status = getHealthStatus(score);
    if (status) counts[status.key] += 1;
    else noData += 1;
  });
  return healthStatuses.map((status) => ({ ...status, name: status.label, value: counts[status.key] })).filter((item) => item.value > 0)
    .concat(noData ? [{ key: "no-data", label: "Belum Ada Data", name: "Belum Ada Data", color: "#64748b", darkColor: "#475569", value: noData }] : []);
}

export const noHealthStatus = {
  label: "Belum Ada Data",
  textClass: "text-slate-500 dark:text-slate-400",
  badgeClass: "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400",
  panelClass: "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40",
  dotClass: "bg-slate-400",
};
