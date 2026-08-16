import type { Vec3 } from "@/types/simulator";

// Minimal 3-vector algebra for the axonometric simulators. Pure — no React,
// no DOM. Vectors are plain {x, y, z} objects rather than tuples so that the
// physics modules read like the equations they implement.

export const vec = (x: number, y: number, z: number): Vec3 => ({ x, y, z });

export const add = (a: Vec3, b: Vec3): Vec3 =>
  vec(a.x + b.x, a.y + b.y, a.z + b.z);

export const sub = (a: Vec3, b: Vec3): Vec3 =>
  vec(a.x - b.x, a.y - b.y, a.z - b.z);

export const scale = (a: Vec3, k: number): Vec3 =>
  vec(a.x * k, a.y * k, a.z * k);

export const dot = (a: Vec3, b: Vec3): number =>
  a.x * b.x + a.y * b.y + a.z * b.z;

export const cross = (a: Vec3, b: Vec3): Vec3 =>
  vec(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);

export const norm = (a: Vec3): number => Math.sqrt(dot(a, a));

/** Rotates a vector about the vertical axis by `angle` (right-hand rule). */
export function rotZ(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return vec(v.x * c - v.y * s, v.x * s + v.y * c, v.z);
}
