/**
 * Mutable store shared between GSAP (writes) and the R3F render loop (reads).
 * Deliberately not React state — updating it never re-renders anything.
 */
export const sceneStore = {
  /** 0 → 1 across the hero "render to reality" sequence */
  progress: 0,
  /** normalised pointer, -1 → 1 */
  pointer: { x: 0, y: 0 },
};
