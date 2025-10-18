"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import Button from "@/components/Button";

interface Lesson {
  id: number;
  title: string;
  description: string;
  type: string;
  estimatedTime: number;
  progress: number;
  isCompleted: boolean;
  exerciseProgress: number;
  completedExercises: number;
  totalExercises: number;
  flashcards: any[];
  exercises: any[];
}

interface Unit {
  id: number;
  title: string;
  description: string;
  level: number;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lessons: Lesson[];
}

export default function UnitPage() {
  const params = useParams();
  const unitId = params.id as string;

  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnitProgress();
  }, [unitId]);

  const fetchUnitProgress = async () => {
    try {
      const response = await fetch(`/api/units/${unitId}/progress?userId=1`);
      if (response.ok) {
        const data = await response.json();
        setUnit(data.unit);
      }
    } catch (error) {
      console.error("Error fetching unit progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case "VOCABULARY":
        return "bg-blue-500";
      case "GRAMMAR":
        return "bg-green-500";
      case "CONVERSATION":
        return "bg-purple-500";
      case "PRONUNCIATION":
        return "bg-orange-500";
      case "CULTURE":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "green";
    if (progress >= 50) return "blue";
    if (progress > 0) return "orange";
    return "gray";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading Unit..."
          subtitle="Please wait while we load your progress"
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Loading unit data...</p>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Unit Not Found"
          subtitle="The unit you're looking for doesn't exist"
        />
        <div className="text-center py-8">
          <Button href="/" variant="primary">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Unit Header */}
      <PageHeader
        title={unit.title}
        subtitle={
          unit.description ||
          "Choose a lesson to continue your learning journey"
        }
      />

      {/* Unit Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {unit.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{unit.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Level</div>
            <div className="text-lg font-bold text-blue-600">{unit.level}</div>
          </div>
        </div>

        {/* Unit Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Unit Progress
            </span>
            <span className="text-sm text-gray-600">
              {unit.completedLessons}/{unit.totalLessons} lessons
            </span>
          </div>
          <ProgressBar
            label=""
            percentage={unit.progress}
            color={getProgressColor(unit.progress)}
            showPercentage={true}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xl font-bold text-blue-600">
              {unit.lessons.length}
            </div>
            <div className="text-xs text-blue-500">Lessons</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xl font-bold text-green-600">
              {unit.lessons.reduce(
                (sum, lesson) => sum + lesson.flashcards.length,
                0
              )}
            </div>
            <div className="text-xs text-green-500">Flashcards</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xl font-bold text-purple-600">
              {unit.lessons.reduce(
                (sum, lesson) => sum + lesson.exercises.length,
                0
              )}
            </div>
            <div className="text-xs text-purple-500">Exercises</div>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {unit.lessons.map((lesson) => (
          <Card key={lesson.id} href={`/units/${unitId}/lessons/${lesson.id}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${getLessonTypeColor(
                    lesson.type
                  )}`}
                ></div>
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {lesson.type.toLowerCase()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {lesson.isCompleted && (
                  <span className="text-green-600 text-sm">✓</span>
                )}
                <span className="text-sm font-medium text-blue-600">
                  {lesson.progress}%
                </span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
              {lesson.title}
            </h3>

            {lesson.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {lesson.description}
              </p>
            )}

            <ProgressBar
              label=""
              percentage={lesson.progress}
              color={getProgressColor(lesson.progress)}
              showPercentage={false}
              className="mb-4"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{lesson.flashcards.length} cards</span>
                <span>
                  {lesson.completedExercises}/{lesson.totalExercises} exercises
                </span>
                {lesson.estimatedTime && (
                  <span>{lesson.estimatedTime} min</span>
                )}
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Card>
        ))}
      </div>

      {/* Back Button */}
      <div className="text-center">
        <Button href="/" variant="outline" className="inline-flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
