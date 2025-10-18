"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function ExercisesPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id: unitId, lessonId } = params;
  const completed = searchParams.get("completed") === "true";

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completingLesson, setCompletingLesson] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  useEffect(() => {
    if (completed && lesson && !completingLesson) {
      completeLesson();
    }
  }, [completed, lesson]);

  const fetchLesson = async () => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setLesson(data);
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  const completeLesson = async () => {
    setCompletingLesson(true);
    setShowSuccess(true);

    try {
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1, // Default user for now
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Show success message for 3 seconds
        setTimeout(() => {
          if (result.nextLesson) {
            // Navigate to next lesson
            router.push(`/units/${unitId}/lessons/${result.nextLesson.id}`);
          } else {
            // Navigate back to unit (all lessons completed)
            router.push(`/units/${unitId}?completed=true`);
          }
        }, 3000);
      }
    } catch (error) {
      console.error("Error completing lesson:", error);
      setShowSuccess(false);
    } finally {
      setCompletingLesson(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading exercises...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Lesson Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The lesson you're looking for doesn't exist.
        </p>
        <Button href="/units" variant="primary">
          Back to Units
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={`Exercises: ${lesson.title}`}
        subtitle={`Complete ${lesson.exercises.length} interactive exercises`}
        className="py-8"
      />

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">
            Lesson Completed!
          </h3>
          <p className="text-green-700 mb-4">
            Great job! You've completed all exercises in this lesson.
          </p>
          {completingLesson ? (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              <span>Saving progress...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                <span>Redirecting to next lesson in 3 seconds...</span>
              </div>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => {
                    // Manual navigation to next lesson
                    const response = fetch(
                      `/api/lessons/${lessonId}/complete`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: 1 }),
                      }
                    )
                      .then((res) => res.json())
                      .then((result) => {
                        if (result.nextLesson) {
                          router.push(
                            `/units/${unitId}/lessons/${result.nextLesson.id}`
                          );
                        } else {
                          router.push(`/units/${unitId}?completed=true`);
                        }
                      });
                  }}
                  variant="primary"
                >
                  Continue to Next Lesson →
                </Button>
                <Button
                  href={`/units/${unitId}/lessons/${lessonId}`}
                  variant="outline"
                >
                  Back to Lesson
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completion Message */}
      {completed && !showSuccess && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">
            Congratulations!
          </h3>
          <p className="text-green-700 mb-4">
            You've completed all exercises in this lesson!
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              href={`/units/${unitId}/lessons/${lessonId}`}
              variant="primary"
            >
              Back to Lesson
            </Button>
            <Button href={`/units/${unitId}`} variant="outline">
              Back to Unit
            </Button>
          </div>
        </div>
      )}

      {/* Exercise List */}
      {!completed && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lesson.exercises.map((exercise: any, index: number) => (
            <Card key={exercise.id}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {exercise.type === "MCQ" && "Multiple Choice"}
                      {exercise.type === "FILL" && "Fill in the Blank"}
                      {exercise.type === "MATCHING" && "Matching"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {exercise.difficulty === 1 && "⭐ Easy"}
                      {exercise.difficulty === 2 && "⭐⭐ Medium"}
                      {exercise.difficulty === 3 && "⭐⭐⭐ Hard"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600">
                    {exercise.points} XP
                  </div>
                  {exercise.timeLimit && (
                    <div className="text-xs text-gray-500">
                      {exercise.timeLimit}s limit
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 text-sm line-clamp-2">
                  {exercise.question}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {exercise.type}
                  </span>
                </div>
                <Button
                  href={`/units/${unitId}/lessons/${lessonId}/exercises/${exercise.id}`}
                  variant="primary"
                  size="sm"
                >
                  Start Exercise
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button href={`/units/${unitId}/lessons/${lessonId}`} variant="outline">
          ← Back to Lesson
        </Button>

        {!completed && lesson.exercises.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              No exercises available for this lesson.
            </p>
            <Button
              href={`/units/${unitId}/lessons/${lessonId}`}
              variant="primary"
            >
              Back to Lesson
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
