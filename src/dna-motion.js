// A slow, continuous cycle with rests at the intact and fully fluid states.
export const DNA_CYCLE_SECONDS = 24;
const smooth = t => t * t * (3 - 2 * t);
export function fluidAmount(seconds) {
  const t = ((seconds % DNA_CYCLE_SECONDS) + DNA_CYCLE_SECONDS) % DNA_CYCLE_SECONDS;
  if (t < 4) return 0;
  if (t < 9) return smooth((t - 4) / 5);
  if (t < 16) return 1;
  if (t < 22) return 1 - smooth((t - 16) / 6);
  return 0;
}
export function motionPhase(seconds) {
  const t = ((seconds % DNA_CYCLE_SECONDS) + DNA_CYCLE_SECONDS) % DNA_CYCLE_SECONDS;
  return t < 4 || t >= 22 ? 'intact' : t < 9 ? 'dissolving' : t < 16 ? 'fluid' : 'reforming';
}
