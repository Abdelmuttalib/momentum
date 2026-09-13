/** Compact duration ("3d", "5h", "45m", "—" for null). */
export function formatDuration(ms: number | null) {
  if (ms == null) return "—";
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "<1m";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
