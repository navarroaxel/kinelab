import type { Metadata } from "next";
import { HomeIndexClient } from "@/components/HomeIndexClient";

export const metadata: Metadata = {
  title: "Kinelab — Interactive Physics Simulators",
  description:
    "A browser-based set of small, focused physics simulators built with Next.js and Canvas: polar coordinates, a vertical ring, a quick-return mechanism, Kepler orbital mechanics, and ten Particle Kinematics exercises (Mecánica Técnica, UTN FRBA).",
};

export default function HomePage() {
  return <HomeIndexClient />;
}
