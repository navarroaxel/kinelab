import type { Metadata } from "next";
import { ParticleKinematicsIndexClient } from "@/components/cpm/ParticleKinematicsIndexClient";

export const metadata: Metadata = {
  title: "Particle Kinematics — TP N°1 | Kinelab",
  description:
    "Ten interactive exercises from Cinemática del Punto Material (Mecánica Técnica, UTN FRBA): drag descent, stopping distance, parabolic tracks, pin-slot mechanisms, motion graphs, cable-pulley systems, radar tracking, circular orbits and elevator cables.",
};

export default function ParticleKinematicsIndexPage() {
  return <ParticleKinematicsIndexClient />;
}
