import type { Metadata } from "next";
import { RigidBodyKinematicsIndexClient } from "@/components/rb/RigidBodyKinematicsIndexClient";

export const metadata: Metadata = {
  title: "Rigid Body Kinematics — TP N°4 | Kinelab",
  description:
    "Ten exercises from Cinemática del Cuerpo Rígido (Mecánica Técnica, UTN FRBA): rotation about a diagonal, composed rotations, planar linkages, a rolling wheel, a planetary reducer, a slotted-pin bar, a fireman's ladder, a rotating liquid ring, and a disc on a rotating arm.",
};

export default function RigidBodyKinematicsIndexPage() {
  return <RigidBodyKinematicsIndexClient />;
}
