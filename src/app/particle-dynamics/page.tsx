import type { Metadata } from "next";
import { ParticleDynamicsIndexClient } from "@/components/pd/ParticleDynamicsIndexClient";

export const metadata: Metadata = {
  title: "Particle Dynamics — TP N°2 | Kinelab",
  description:
    "Fourteen exercises from Dinámica del Punto Material (Mecánica Técnica, UTN FRBA): viscous impact, drag descent, the vertical ring, Atwood machines, orbital transfers, hoists, springs, friction, vehicle power, motors, coupling, and staged rockets.",
};

export default function ParticleDynamicsIndexPage() {
  return <ParticleDynamicsIndexClient />;
}
