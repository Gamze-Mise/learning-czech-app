import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import type { DashboardStats } from "@/hooks/learner/useDashboardStats";

type Props = {
  stats: DashboardStats;
};

export default function DashboardProgressSection({ stats }: Props) {
  return (
    <Card>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Learning Progress</h2>
      <div className="space-y-4">
        <ProgressBar
          label="Overall Progress"
          percentage={stats.overallProgress}
          color="blue"
        />
        <ProgressBar
          label="Vocabulary Mastery"
          percentage={stats.vocabularyMastery}
          color="green"
        />
        <ProgressBar
          label="Grammar Understanding"
          percentage={stats.grammarUnderstanding}
          color="purple"
        />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>
          {stats.lessonsCompleted} of {stats.totalLessons} lessons completed
        </p>
        <p>
          {stats.flashcardsMastered} of {stats.totalFlashcards} flashcards
          mastered
        </p>
      </div>
    </Card>
  );
}
