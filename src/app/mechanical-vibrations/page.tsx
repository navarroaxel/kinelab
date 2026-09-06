import type { Metadata } from "next";
import { MechanicalVibrationsIndexClient } from "@/components/vib/MechanicalVibrationsIndexClient";

export const metadata: Metadata = {
  title: "Mechanical Vibrations — TP N°3 | Kinelab",
  description:
    "Vibraciones Mecánicas (Mecánica Técnica, UTN FRBA): rotating unbalance, base-excited suspension, vibration isolation, moving supports, pressure gauge design, and the release of a hanging mass, undamped and overdamped.",
};

export default function MechanicalVibrationsIndexPage() {
  return <MechanicalVibrationsIndexClient />;
}
