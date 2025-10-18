"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function Home() {
  const [courses, setCourses] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch user progress (assuming userId 1 for now)
      const progressResponse = await fetch("/api/users/progress?userId=1");
      const progressData = await progressResponse.json();
      setUserProgress(progressData);

      // Fetch courses with units and lessons
      const coursesResponse = await fetch("/api/courses");
      const coursesData = await coursesResponse.json();
      setCourses(coursesData.courses || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading your progress...</p>
      </div>
    );
  }

  // Get first unit and lesson dynamically
  const firstCourse = courses[0];
  const firstUnit = firstCourse?.units[0];
  const firstLesson = firstUnit?.lessons[0];

  // Determine continue learning link
  const continueLearningLink = userProgress?.lastIncompleteLesson
    ? `/units/${userProgress.lastIncompleteLesson.unitId}/lessons/${userProgress.lastIncompleteLesson.id}`
    : firstLesson
    ? `/units/${firstUnit.id}/lessons/${firstLesson.id}`
    : "/units";

  // Determine start learning link
  const startLearningLink = firstLesson
    ? `/units/${firstUnit.id}/lessons/${firstLesson.id}`
    : "/units";

  // Determine flashcards link
  const flashcardsLink = firstLesson
    ? `/units/${firstUnit.id}/lessons/${firstLesson.id}/flashcards`
    : "/units";

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <PageHeader
        title="Learn Czech Language"
        subtitle="Master Czech with interactive lessons, flashcards, and exercises"
        className="text-center py-12"
      />

      {/* Continue Learning Section - Show if user has progress */}
      {userProgress?.stats && userProgress.stats.lessonsCompleted > 0 ? (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Continue Learning</h2>
              <p className="text-blue-100 mb-2">
                You've completed {userProgress.stats.lessonsCompleted} lessons.
                Keep going!
              </p>
              {userProgress.lastIncompleteLesson && (
                <p className="text-sm text-blue-200">
                  Next: {userProgress.lastIncompleteLesson.title}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-200 mb-2">
                {userProgress.stats.xp} XP •{" "}
                {userProgress.stats.lessonsCompleted} lessons
              </div>
              <Button
                href={continueLearningLink}
                variant="secondary"
                size="lg"
                className="!bg-white !text-blue-700 hover:!bg-blue-50 !font-bold !border-2 !border-white shadow-lg"
              >
                Continue Learning →
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Quick Start Section - Show if user has no progress
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to Start Learning?</h2>
          <p className="text-green-100 mb-4">
            {firstUnit
              ? `${firstUnit.title} is ready for you!`
              : "Start your Czech learning journey!"}
          </p>
          <Button
            href={startLearningLink}
            variant="outline"
            size="lg"
            className="!bg-white !text-green-800 hover:!bg-green-50 !font-bold !border-2 !border-white shadow-lg !text-lg"
          >
            {firstLesson ? `Start ${firstLesson.title}` : "Start Learning"}
          </Button>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Start */}
        {firstLesson && (
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Quick Start
            </h3>
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

        {/* Your Progress */}
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

      {/* Recommended Section */}
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
            <p className="text-sm text-gray-600 mb-3">
              Review vocabulary cards
            </p>
            <Button href={flashcardsLink} variant="primary" size="sm">
              Review Cards
            </Button>
          </div>
        </div>
      </Card>

      {/* Recommended Lessons */}
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
