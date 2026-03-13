/**
 * Seedable PRNG (mulberry32) for reproducible combo generation.
 * Given the same seed, produces the same sequence of random numbers.
 */
export type SeededRandom = () => number;

export function createSeededRandom(seed: number): SeededRandom {
  let state = seed | 0;
  return function mulberry32(): number {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFromString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
