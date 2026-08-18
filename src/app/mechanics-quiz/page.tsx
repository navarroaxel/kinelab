"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { MechanicsQuiz } from "@/components/mechanics-quiz/MechanicsQuiz";
import { SimulatorHeader } from "@/components/SimulatorHeader";
import { ProjectCredits } from "@/components/ProjectCredits";
import { LanguageProvider } from "@/contexts/LanguageContext";

function MechanicsQuizContent() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto max-w-3xl p-4">
      <div className="flex flex-col gap-4">
        <SimulatorHeader />

        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t("mq.title")}
          </h1>
        </header>

        <MechanicsQuiz />

        <ProjectCredits />
      </div>
    </main>
  );
}

export default function MechanicsQuizPage() {
  return (
    <LanguageProvider>
      <MechanicsQuizContent />
    </LanguageProvider>
  );
}
