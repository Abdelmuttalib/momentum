import type { RangeKey } from "@/server/analytics/shared";

export type BucketGranularity = "day" | "week" | "month";

export type TrendBucket = {
  /** Bucket start as ISO date (YYYY-MM-DD). */
  date: string;
  /** Human label for chart axes. */
  label: string;
  completedTasks: number;
  completedEffort: number;
};

/** daily ≤14d, weekly ≤120d, monthly above (matches plan). */
export function granularityForRange(range: RangeKey): BucketGranularity {
  if (range === "7d") return "day";
  if (range === "30d" || range === "90d") return "week";
  return "month";
}

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function labelFor(d: Date, granularity: BucketGranularity) {
  return d.toLocaleDateString("en-us", {
    month: "short",
    day: granularity === "day" ? "numeric" : undefined,
  });
}

/**
 * Zero-filled buckets between start (inclusive) and now, then folds
 * completed items (by completedAt) into them. Pure function — usable
 * server- or client-side.
 */
export function bucketCompletions(
  items: { completedAt: Date | string; effortPoints: number | null }[],
  range: RangeKey,
  start: Date | null,
  now = new Date()
): { granularity: BucketGranularity; buckets: TrendBucket[] } {
  const granularity = granularityForRange(range);
  const from = start ? startOfDay(start) : null;

  // Bound the "all" range to the oldest item (max 24 buckets back).
  let cursor: Date;
  if (granularity === "month") {
    const oldest =
      from ??
      items.reduce<Date | null>(
        (min, i) => {
          const d = new Date(i.completedAt);
          return !min || d < min ? d : min;
        },
        null
      ) ??
      now;
    cursor = new Date(oldest.getFullYear(), oldest.getMonth(), 1);
    // Cap runaway bucket counts.
    const monthsBack = Math.min(
      24,
      (now.getFullYear() - cursor.getFullYear()) * 12 +
        (now.getMonth() - cursor.getMonth()) +
        1
    );
    cursor = addMonths(new Date(now.getFullYear(), now.getMonth(), 1), -(monthsBack - 1));
  } else {
    const spanDays = granularity === "day" ? 14 : 18;
    const earliest = addDays(startOfDay(now), -(spanDays - 1));
    cursor = from && from > earliest ? alignWeek(from, granularity) : earliest;
    if (granularity === "week") cursor = alignWeek(cursor, granularity);
  }

  const buckets: TrendBucket[] = [];
  const index = new Map<string, TrendBucket>();
  const end = startOfDay(now);
  let c = new Date(cursor);
  let guard = 0;
  while ((granularity === "month" ? c <= end : c <= end) && guard < 30) {
    const key = granularity === "month" ? toKey(c).slice(0, 7) + "-01" : toKey(c);
    const b: TrendBucket = {
      date: key,
      label: labelFor(c, granularity),
      completedTasks: 0,
      completedEffort: 0,
    };
    buckets.push(b);
    index.set(key, b);
    c = granularity === "month" ? addMonths(c, 1) : addDays(c, granularity === "day" ? 1 : 7);
    guard++;
  }

  for (const item of items) {
    const d = new Date(item.completedAt);
    let key: string;
    if (granularity === "month") {
      key = toKey(new Date(d.getFullYear(), d.getMonth(), 1));
    } else if (granularity === "week") {
      key = toKey(alignWeek(startOfDay(d), granularity));
    } else {
      key = toKey(startOfDay(d));
    }
    const b = index.get(key);
    if (!b) continue;
    b.completedTasks += 1;
    b.completedEffort += item.effortPoints ?? 0;
  }

  return { granularity, buckets };
}

function alignWeek(d: Date, granularity: BucketGranularity) {
  if (granularity !== "week") return d;
  const c = new Date(d);
  const day = c.getDay(); // Sunday start
  c.setDate(c.getDate() - day);
  return c;
}
