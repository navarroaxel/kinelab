import { Suspense } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ExerciseNav } from "@/components/cpm/ExerciseNav";

export default function ParticleKinematicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className="mx-auto max-w-7xl p-4">
        <Suspense fallback={null}>
          <ExerciseNav />
        </Suspense>
      </div>
      {children}
    </LanguageProvider>
  );
}
