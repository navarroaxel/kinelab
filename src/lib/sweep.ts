/**
 * Triangle wave: a quantity starting at `x0` and travelling at speed `rate`
 * between `lo` and `hi`, bouncing off both stops. Returns the value and the
 * sign of its current rate (0 when the quantity is frozen).
 *
 * Shared by every simulator whose driven member oscillates between two
 * physical stops instead of sweeping through a full turn — the fireman's
 * ladder's elevation/extension and the pin-slot-bar's slot angle.
 */
export function sweep(
  t: number,
  x0: number,
  rate: number,
  lo: number,
  hi: number,
): { value: number; sign: number } {
  const span = hi - lo;
  const start = Math.min(Math.max(x0, lo), hi);
  if (span <= 0 || rate === 0) return { value: start, sign: 0 };

  const period = 2 * span;
  const travelled = (((rate * t + (start - lo)) % period) + period) % period;
  return travelled <= span
    ? { value: lo + travelled, sign: 1 }
    : { value: lo + (period - travelled), sign: -1 };
}
