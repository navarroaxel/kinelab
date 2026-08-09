"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { VibrationsQuiz } from "@/components/vibrations-quiz/VibrationsQuiz";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";
import { LanguageProvider } from "@/contexts/LanguageContext";

function VibrationsQuizContent() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto max-w-3xl p-4">
      <div className="flex flex-col gap-4">
        <SimulatorHeader />

        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t("vq.title")}
          </h1>
        </header>

        <VibrationsQuiz />

        <ProjectCredits />
      </div>
    </main>
  );
}

export default function VibrationsQuizPage() {
  return (
    <LanguageProvider>
      <VibrationsQuizContent />
    </LanguageProvider>
  );
}
