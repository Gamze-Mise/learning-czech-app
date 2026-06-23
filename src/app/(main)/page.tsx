"use client";

import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageLoadingSpinner from "@/components/learner/PageLoadingSpinner";
import ContinueLearningBanner from "@/components/home/ContinueLearningBanner";
import QuickStartSection from "@/components/home/QuickStartSection";
import { useHomePageData } from "@/hooks/learner/useHomePageData";

export default function Home() {
  const { courses, userProgress, loading } = useHomePageData();

  if (loading) {
    return (
      <PageLoadingSpinner
        size="sm"
        message="Loading your progress..."
      />
    );
  }

  const firstCourse = courses[0];
  const firstUnit = firstCourse?.units[0];
  const firstLesson = firstUnit?.lessons[0];

  const continueLearningLink = userProgress?.lastIncompleteLesson
    ? `/units/${userProgress.lastIncompleteLesson.unitId}/lessons/${userProgress.lastIncompleteLesson.id}`
    : firstLesson
      ? `/units/${firstUnit.id}/lessons/${firstLesson.id}`
      : "/units";

  const startLearningLink = firstLesson
    ? `/units/${firstUnit.id}/lessons/${firstLesson.id}`
    : "/units";

  const flashcardsLink = firstLesson
    ? `/units/${firstUnit.id}/lessons/${firstLesson.id}/flashcards`
    : "/units";

  const hasProgress =
    userProgress?.stats && userProgress.stats.lessonsCompleted > 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Learn Czech Language"
        subtitle="Master Czech with interactive lessons, flashcards, and exercises"
        className="text-center py-12"
      />

      {hasProgress ? (
        <ContinueLearningBanner
          lessonsCompleted={userProgress.stats.lessonsCompleted}
          xp={userProgress.stats.xp}
          lastIncompleteLesson={userProgress.lastIncompleteLesson}
          continueLearningLink={continueLearningLink}
        />
      ) : (
        <QuickStartSection
          firstUnit={firstUnit}
          firstLesson={firstLesson}
          startLearningLink={startLearningLink}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {firstLesson && (
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Start</h3>
            <p className="text-gray-600 mb-4">
              Jump right into the first lesson: {firstLesson.title}
            </p>
            <Button
              href={startLearningLink}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Start Learning
            </Button>
          </Card>
        )}

        {userProgress?.stats && (
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Your Progress
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Lessons Completed:</span>
                <span className="font-semibold text-blue-600">
                  {userProgress.stats.lessonsCompleted}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total XP:</span>
                <span className="font-semibold text-purple-600">
                  {userProgress.stats.xp} XP
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Current Streak:</span>
                <span className="font-semibold text-green-600">
                  {userProgress.stats.currentStreak} days
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Button href="/dashboard" variant="secondary" className="w-full">
                View Full Dashboard
              </Button>
            </div>
          </Card>
        )}
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recommended for You
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">👋</div>
            <h4 className="font-medium text-gray-800 mb-1">Basic Greetings</h4>
            <p className="text-sm text-gray-600 mb-3">
              Learn essential Czech greetings
            </p>
            <Button
              href={firstUnit ? `/units/${firstUnit.id}` : "/units"}
              variant="primary"
              size="sm"
            >
              Start Learning
            </Button>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">🎴</div>
            <h4 className="font-medium text-gray-800 mb-1">Flashcards</h4>
            <p className="text-sm text-gray-600 mb-3">Review vocabulary cards</p>
            <Button href={flashcardsLink} variant="primary" size="sm">
              Review Cards
            </Button>
          </div>
        </div>
      </Card>

      {courses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Available Lessons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses[0]?.units
              .flatMap((unit: any) => unit.lessons)
              .slice(0, 6)
              .map((lesson: any) => (
                <Card key={lesson.id} className="p-4">
                  <h4 className="font-bold text-gray-900 mb-2">
                    {lesson.title}
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    {lesson.description}
                  </p>
                  <Button
                    href={`/units/${lesson.unitId}/lessons/${lesson.id}`}
                    variant="outline"
                    className="w-full"
                  >
                    Start Lesson
                  </Button>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
