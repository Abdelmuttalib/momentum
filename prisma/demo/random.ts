/**
 * Deterministic seeded RNG (mulberry32). Same seed => same sequence, so a
 * given COMPANY_ID + seed + config always produces the same dataset shape.
 * Never use Math.random() in generators — always go through this.
 */

function hashSeed(seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

export type Rng = {
  /** float in [0, 1) */
  float: () => number;
  /** int in [min, max] inclusive */
  int: (min: number, max: number) => number;
  /** true with probability p */
  chance: (p: number) => boolean;
  /** random array element */
  pick: <T>(arr: readonly T[]) => T;
  /** weighted choice; weights need not sum to 1 */
  weighted: <T>(entries: readonly (readonly [T, number])[]) => T;
  /** date in [from, to] */
  dateBetween: (from: Date, to: Date) => Date;
};

export function createRng(seed: string): Rng {
  let state = hashSeed(seed);

  function next(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    float: () => next(),
    int: (min: number, max: number) =>
      min + Math.floor(next() * (max - min + 1)),
    chance: (p: number) => next() < p,
    pick: <T,>(arr: readonly T[]): T => {
      if (arr.length === 0) throw new Error("pick() from empty array");
      return arr[Math.floor(next() * arr.length)] as T;
    },
    weighted: <T,>(entries: readonly (readonly [T, number])[]): T => {
      const total = entries.reduce((n, [, w]) => n + w, 0);
      let roll = next() * total;
      for (const [value, weight] of entries) {
        roll -= weight;
        if (roll <= 0) return value;
      }
      return entries[entries.length - 1]?.[0] as T;
    },
    dateBetween: (from: Date, to: Date) =>
      new Date(from.getTime() + next() * (to.getTime() - from.getTime())),
  };
}
