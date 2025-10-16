"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import Button from "@/components/Button";

export default function LessonPage() {
  const params = useParams();
  const { id: unitId, lessonId } = params;

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

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

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      // For demo purposes, show alert. In production, replace with actual audio files
      if (audioUrl.includes("/uploads/")) {
        alert(
          `🎵 Audio would play: ${audioUrl}\n\n(Demo mode - audio files not yet uploaded)`
        );
      } else {
        const audio = new Audio(audioUrl);
        audio.play().catch((error) => {
          console.error("Audio play failed:", error);
          alert(`🎵 Audio file not found: ${audioUrl}`);
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading..."
          subtitle="Please wait while we load the lesson"
        />
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Lesson Not Found"
          subtitle="The lesson you're looking for doesn't exist"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <PageHeader
        title={lesson.title}
        subtitle={
          lesson.description || "Learn new vocabulary and practice exercises"
        }
      />

      {/* Lesson Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {lesson.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Difficulty</div>
            <div className="text-lg font-bold text-blue-600">
              {Array.from({ length: lesson.difficulty }, (_, i) => "★").join(
                ""
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xl font-bold text-blue-600">
              {lesson.parts.length}
            </div>
            <div className="text-xs text-blue-500">Parts</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xl font-bold text-green-600">
              {lesson.flashcards.length}
            </div>
            <div className="text-xs text-green-500">Flashcards</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xl font-bold text-purple-600">
              {lesson.exercises.length}
            </div>
            <div className="text-xs text-purple-500">Exercises</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-xl font-bold text-orange-600">
              {lesson.estimatedTime || 0}
            </div>
            <div className="text-xs text-orange-500">Minutes</div>
          </div>
        </div>
      </div>

      {/* Lesson Parts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Lesson Content</h3>
        {lesson.parts.map((part: any, index: number) => (
          <Card key={part.id}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {part.order}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{part.title}</h4>
                  <span className="text-sm text-gray-700 capitalize font-medium">
                    {part.type.toLowerCase()}
                  </span>
                </div>
              </div>
              {part.duration && (
                <span className="text-sm text-gray-500">{part.duration}s</span>
              )}
            </div>

            {part.type === "TEXT" && part.content && (
              <div className="prose prose-sm max-w-none text-gray-900">
                <div
                  className="text-gray-900 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      (part.content as any)?.markdown?.replace(/\n/g, "<br>") ||
                      "",
                  }}
                />
              </div>
            )}

            {part.type === "AUDIO" && part.audioUrl && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">
                      Audio Content
                    </p>
                    <p className="text-xs text-gray-700">Click to play</p>
                  </div>
                  <button
                    onClick={() => playAudio(part.audioUrl)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Play
                  </button>
                </div>
              </div>
            )}

            {part.type === "VIDEO" && part.videoUrl && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">
                      Video Content
                    </p>
                    <p className="text-xs text-gray-700">Click to watch</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Watch
                  </button>
                </div>
              </div>
            )}

            {part.type === "FLASHCARD_LIST" && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      Flashcard Practice
                    </p>
                    <p className="text-xs text-gray-500">
                      {lesson.flashcards.length} cards available
                    </p>
                  </div>
                  <Button
                    href={`/units/${unitId}/lessons/${lessonId}/flashcards`}
                    variant="primary"
                    size="sm"
                  >
                    Practice
                  </Button>
                </div>
              </div>
            )}

            {part.type === "EXERCISE" && (
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      Exercises
                    </p>
                    <p className="text-xs text-gray-500">
                      {lesson.exercises.length} exercises available
                    </p>
                  </div>
                  <Button
                    href={`/units/${unitId}/lessons/${lessonId}/exercises`}
                    variant="primary"
                    size="sm"
                  >
                    Start
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Flashcards Preview */}
      {lesson.flashcards.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Vocabulary Cards
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lesson.flashcards.slice(0, 6).map((flashcard: any) => (
              <Card key={flashcard.id}>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 mb-2">
                    {flashcard.frontText}
                  </div>
                  <div className="text-sm text-gray-800 mb-3 font-medium">
                    {flashcard.backText}
                  </div>
                  {flashcard.example && (
                    <div className="text-xs text-gray-700 italic">
                      {flashcard.example}
                    </div>
                  )}
                  <div className="flex items-center justify-center mt-3 space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {flashcard.category}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Level {flashcard.difficulty}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {lesson.flashcards.length > 6 && (
            <div className="text-center">
              <Button variant="outline">
                View All {lesson.flashcards.length} Cards
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          href={`/units/${unitId}/lessons/${lessonId}/practice`}
          variant="primary"
          size="lg"
          className="flex-1"
        >
          Start Practice
        </Button>
        <Button
          href={`/units/${unitId}`}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          Back to Unit
        </Button>
      </div>
    </div>
  );
}
