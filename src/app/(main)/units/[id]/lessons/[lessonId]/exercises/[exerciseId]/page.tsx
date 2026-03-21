"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { devError } from "@/lib/logger";

interface Exercise {
  id: number;
  type: string;
  question: string;
  options: any[];
  answer: string;
  explanation: string;
  difficulty: number;
  points: number;
  timeLimit: number | null;
  order: number;
  lessonId: number;
}

export default function ExercisePage() {
  const params = useParams();
  const router = useRouter();
  const { id: unitId, lessonId, exerciseId } = params;

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [matchingPairs, setMatchingPairs] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [shuffledRightItems, setShuffledRightItems] = useState<string[]>([]);
  const [lastMatchFeedback, setLastMatchFeedback] = useState<
    "correct" | "incorrect" | null
  >(null);

  const fetchExercise = useCallback(async () => {
    try {
      // Fetch current exercise
      const exerciseResponse = await fetch(`/api/exercises/${exerciseId}`);
      if (exerciseResponse.ok) {
        const exerciseData = await exerciseResponse.json();
        setExercise(exerciseData);
        if (exerciseData.timeLimit) {
          setTimeLeft(exerciseData.timeLimit);
        }

        // For MATCHING exercises, pre-shuffle right-side items so they are not aligned
        if (
          exerciseData.type === "MATCHING" &&
          Array.isArray(exerciseData.options)
        ) {
          const rightItems: string[] = exerciseData.options.map(
            (opt: any) => opt.right
          );
          const shuffled = [...rightItems];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          setShuffledRightItems(shuffled);
        }

        // Fetch all exercises for this lesson
        const allExercisesResponse = await fetch(
          `/api/exercises/lesson/${lessonId}`
        );
        if (allExercisesResponse.ok) {
          const allExercisesData = await allExercisesResponse.json();
          setAllExercises(allExercisesData.exercises || []);
        }
      }
    } catch (error) {
      devError("Error fetching exercise:", error);
    } finally {
      setLoading(false);
    }
  }, [exerciseId, lessonId]);

  useEffect(() => {
    void fetchExercise();
    // Reset state when exercise changes
    setSelectedAnswer("");
    setUserAnswer("");
    setMatchingPairs({});
    setSelectedLeft(null);
    setShowResult(false);
    setIsCorrect(false);
    setTimeLeft(null);
    setShuffledRightItems([]);
    setLastMatchFeedback(null);
  }, [fetchExercise]);

  // Helper function to normalize text for comparison (remove accents, case-insensitive)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics/accents
      .replace(/[^\w\s]/g, ""); // Remove punctuation
  };

  // Helper function to check if answers are similar enough
  const isAnswerAcceptable = (
    userAnswer: string,
    correctAnswer: string
  ): boolean => {
    const normalizedUser = normalizeText(userAnswer);
    const normalizedCorrect = normalizeText(correctAnswer);

    // Exact match after normalization
    if (normalizedUser === normalizedCorrect) {
      return true;
    }

    // Check for common variations (optional)
    const variations = [
      normalizedCorrect.replace(/\s+/g, ""), // Remove spaces
      normalizedCorrect.replace(/\s+/g, " "), // Normalize spaces
    ];

    return variations.some((variation) => normalizedUser === variation);
  };

  const handleSubmit = () => {
    if (!exercise) return;

    let correct = false;
    let correctAnswer = "";

    if (exercise.type === "MCQ") {
      // For MCQ, find the correct option
      const correctOption = exercise.options.find(
        (opt: any) => opt.correct === true
      );
      correctAnswer = correctOption?.text || "";
      correct = selectedAnswer === correctAnswer;
    } else if (exercise.type === "FILL") {
      // For FILL, use the answer field with flexible matching
      correctAnswer = exercise.answer || "";
      correct = isAnswerAcceptable(userAnswer, correctAnswer);
    } else if (exercise.type === "MATCHING") {
      // For MATCHING, check if all pairs are correctly matched
      const correctPairs = exercise.options.length;
      const userPairs = Object.keys(matchingPairs).length;

      if (userPairs === correctPairs) {
        // Check if all matches are correct
        correct = exercise.options.every(
          (option: any) => matchingPairs[option.left] === option.right
        );
        correctAnswer = `${correctPairs} pairs matched correctly`;
      } else {
        correct = false;
        correctAnswer = `Match all ${correctPairs} pairs`;
      }
    }

    setIsCorrect(correct);
    setShowResult(true);

    // Save exercise result to database
    saveExerciseResult(correct, correctAnswer);
  };

  const handleSubmitRef = useRef(handleSubmit);
  handleSubmitRef.current = handleSubmit;

  useEffect(() => {
    if (exercise?.timeLimit && timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            handleSubmitRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [exercise?.timeLimit, timeLeft]);

  const saveExerciseResult = async (correct: boolean, answer: string) => {
    try {
      const response = await fetch("/api/exercises/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1, // Default user for now
          exerciseId: exercise?.id,
          correct,
          answer:
            exercise?.type === "FILL"
              ? userAnswer
              : exercise?.type === "MATCHING"
              ? JSON.stringify(matchingPairs)
              : selectedAnswer,
          timeSpent: exercise?.timeLimit
            ? exercise.timeLimit - (timeLeft || 0)
            : null,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        devError(
          "Failed to save exercise result:",
          response.status,
          response.statusText,
          errorText
        );
      }
    } catch (error) {
      devError("Error saving exercise result:", error);
    }
  };

  const handleNext = () => {
    if (!exercise || !allExercises.length) {
      router.push(`/units/${unitId}/lessons/${lessonId}/exercises`);
      return;
    }

    // Find current exercise index
    const currentIndex = allExercises.findIndex((ex) => ex.id === exercise.id);

    // Check if there's a next exercise
    if (currentIndex < allExercises.length - 1) {
      const nextExercise = allExercises[currentIndex + 1];
      router.push(
        `/units/${unitId}/lessons/${lessonId}/exercises/${nextExercise.id}`
      );
    } else {
      // No more exercises, go back to exercises list with completion message
      router.push(
        `/units/${unitId}/lessons/${lessonId}/exercises?completed=true`
      );
    }
  };

  const handleLeftClick = (leftItem: string) => {
    if (selectedLeft === leftItem) {
      setSelectedLeft(null); // Deselect if clicking the same item
    } else {
      setSelectedLeft(leftItem);
    }
  };

  const handleRightClick = (rightItem: string) => {
    if (selectedLeft) {
      // Check if this pair is correct based on exercise options
      const isCorrectPair = exercise?.options.some(
        (opt: any) => opt.left === selectedLeft && opt.right === rightItem
      );

      // Always record the pair (right or wrong) so the click feels responsive
      setMatchingPairs((prev) => ({
        ...prev,
        [selectedLeft]: rightItem,
      }));
      setLastMatchFeedback(isCorrectPair ? "correct" : "incorrect");
      setSelectedLeft(null);
    }
  };

  const removePair = (leftItem: string) => {
    setMatchingPairs((prev) => {
      const newPairs = { ...prev };
      delete newPairs[leftItem];
      return newPairs;
    });
    // After removing a pair, allow the user to immediately rematch this left item
    setSelectedLeft(leftItem);
    setLastMatchFeedback(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading Exercise..."
          subtitle="Please wait while we load your exercise"
        />
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Exercise Not Found"
          subtitle="The exercise you are looking for does not exist"
        />
        <div className="text-center py-8">
          <Button href={`/units/${unitId}/lessons/${lessonId}/exercises`}>
            Back to Exercises
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={`Exercise ${exercise.id}`}
        subtitle={`${exercise.type} • ${exercise.difficulty} difficulty • ${exercise.points} points`}
      />

      {/* Timer */}
      {timeLeft !== null && (
        <div className="text-center">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-lg ${
              timeLeft < 30
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            <span className="text-lg font-bold">⏱️ {formatTime(timeLeft)}</span>
          </div>
        </div>
      )}

      {/* Exercise Content */}
      <Card>
        <div className="space-y-6">
          {/* Question */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Question:
            </h3>
            <p className="text-gray-800 text-lg">{exercise.question}</p>
          </div>

          {/* Answer Section */}
          {!showResult && (
            <div className="space-y-4">
              {exercise.type === "MCQ" && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">
                    Choose your answer:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {exercise.options.map((option, index) => {
                      const optionText =
                        typeof option === "string" ? option : option.text;
                      return (
                        <button
                          type="button"
                          key={index}
                          onClick={() => setSelectedAnswer(optionText)}
                          className={`p-4 rounded-lg border-2 text-left transition-colors ${
                            selectedAnswer === optionText
                              ? "border-blue-500 bg-blue-100 text-blue-900 font-bold"
                              : "border-gray-400 hover:border-blue-400 hover:bg-blue-50 text-gray-900 bg-white font-medium"
                          }`}
                        >
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {optionText}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {exercise.type === "FILL" && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">
                    Type your answer:
                  </h4>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg text-gray-900 bg-white"
                    placeholder="Enter your answer here..."
                    onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                  />
                </div>
              )}

              {exercise.type === "MATCHING" && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">
                    Click a Czech word, then click its English translation:
                  </h4>

                  {/* Instructions */}
                  <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                    <p>
                      💡 <strong>How to play:</strong> First click a Czech word
                      (left), then click its English meaning (right) to make a
                      match.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column - Czech Words */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-600 mb-3">
                        🇨🇿 Czech
                      </h5>
                      {exercise.options.map((option, index) => {
                        const leftItem = option.left;
                        const isSelected = selectedLeft === leftItem;
                        const matchedRight = matchingPairs[leftItem];
                        const isMatched = !!matchedRight;
                        const isCorrectMatch =
                          isMatched &&
                          exercise.options.some(
                            (opt: any) =>
                              opt.left === leftItem && opt.right === matchedRight
                          );

                        return (
                          <div key={index} className="relative">
                            <button
                              type="button"
                              onClick={() => handleLeftClick(leftItem)}
                              disabled={isCorrectMatch}
                              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                                isCorrectMatch
                                  ? "bg-green-100 border-green-400 text-green-900 cursor-not-allowed font-semibold"
                                  : isMatched
                                  ? "bg-red-100 border-red-400 text-red-900 font-semibold"
                                  : isSelected
                                  ? "bg-blue-100 border-blue-500 text-blue-900 font-bold shadow-md"
                                  : "bg-white border-gray-400 hover:border-blue-400 hover:bg-blue-50 text-gray-900 font-medium"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{leftItem}</span>
                                {isMatched && (
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-green-800 font-semibold">
                                      → {matchingPairs[leftItem]}
                                    </span>
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removePair(leftItem);
                                      }}
                                      className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                                    >
                                      ✕
                                    </div>
                                  </div>
                                )}
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right Column - English Words (shuffled) */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-600 mb-3">
                        🇺🇸 English
                      </h5>
                      {(shuffledRightItems.length
                        ? shuffledRightItems
                        : exercise.options.map((opt: any) => opt.right)
                      ).map((rightItem, index) => {
                        const matchedEntry = Object.entries(matchingPairs).find(
                          ([, value]) => value === rightItem
                        );
                        const isMatched = !!matchedEntry;
                        const matchedLeft = matchedEntry?.[0];
                        const isCorrectUse =
                          isMatched &&
                          exercise.options.some(
                            (opt: any) =>
                              opt.left === matchedLeft && opt.right === rightItem
                          );
                        const isUsed = isMatched;

                        return (
                          <button
                            type="button"
                            key={index}
                            onClick={() => handleRightClick(rightItem)}
                            disabled={!selectedLeft || isUsed}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                              isUsed && isCorrectUse
                                ? "bg-green-100 border-green-400 text-green-900 cursor-not-allowed font-semibold"
                                : isUsed && !isCorrectUse
                                ? "bg-red-100 border-red-400 text-red-900 cursor-not-allowed font-semibold"
                                : selectedLeft
                                ? "bg-green-50 border-green-400 hover:bg-green-100 text-gray-900 font-medium"
                                : "bg-gray-100 border-gray-400 text-gray-600 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{rightItem}</span>
                              {isUsed && isCorrectUse && (
                                <span className="text-green-600">✓</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-800 font-medium">
                        Progress: {Object.keys(matchingPairs).length} /{" "}
                        {exercise.options.length} pairs matched
                      </span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (Object.keys(matchingPairs).length /
                                exercise.options.length) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    {lastMatchFeedback === "correct" && (
                      <p className="mt-2 text-green-700">
                        ✓ Nice! That&apos;s a correct match.
                      </p>
                    )}
                    {lastMatchFeedback === "incorrect" && (
                      <p className="mt-2 text-red-700">
                        ✗ Those don&apos;t match. Try a different pair.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  size="lg"
                  disabled={
                    (exercise.type === "MCQ" && !selectedAnswer) ||
                    (exercise.type === "FILL" && !userAnswer.trim()) ||
                    (exercise.type === "MATCHING" &&
                      Object.keys(matchingPairs).length !==
                        exercise.options.length)
                  }
                >
                  Submit Answer
                </Button>
              </div>
            </div>
          )}

          {/* Result Section */}
          {showResult && (
            <div className="space-y-4">
              <div
                className={`p-6 rounded-lg ${
                  isCorrect
                    ? "bg-green-50 border-2 border-green-200"
                    : "bg-red-50 border-2 border-red-200"
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl">{isCorrect ? "✅" : "❌"}</span>
                  <h3
                    className={`text-xl font-bold ${
                      isCorrect ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </h3>
                </div>

                {exercise.type === "MATCHING" ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-800">
                      Your matches:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {exercise.options.map((opt: any, index: number) => {
                        const userRight = matchingPairs[opt.left];
                        const pairCorrect = userRight === opt.right;
                        return (
                          <div
                            key={index}
                            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                              pairCorrect
                                ? "bg-green-50 border-green-200 text-green-800"
                                : "bg-red-50 border-red-200 text-red-800"
                            }`}
                          >
                            <span>
                              {opt.left}{" "}
                              <span className="text-gray-500">→</span>{" "}
                              {userRight || "—"}
                            </span>
                            <span className="ml-2">
                              {pairCorrect ? "✓" : `→ ${opt.right}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">
                        Your answer:{" "}
                      </span>
                      <span className="font-semibold">
                        {exercise.type === "FILL" ? userAnswer : selectedAnswer}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Correct answer:{" "}
                      </span>
                      <span className="font-semibold text-green-700">
                        {exercise.type === "MCQ"
                          ? exercise.options.find(
                              (opt: any) => opt.correct === true
                            )?.text || exercise.answer
                          : exercise.answer}
                      </span>
                    </div>
                    {/* Show reminder for FILL exercises when answer is accepted but not exactly correct */}
                    {exercise.type === "FILL" &&
                      isCorrect &&
                      userAnswer.trim() !== exercise.answer && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <span className="font-medium text-blue-700">
                            💡 Remember:{" "}
                          </span>
                          <span className="text-blue-800">
                            {`The correct spelling is "${exercise.answer}" (with proper capitalization and accents)`}
                          </span>
                        </div>
                      )}
                  </div>
                )}

                {exercise.explanation && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">
                      Explanation:{" "}
                    </span>
                    <span className="text-gray-800">
                      {exercise.explanation}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <Button onClick={handleNext} variant="primary" size="lg">
                  {allExercises.length > 0 && exercise
                    ? allExercises.findIndex((ex) => ex.id === exercise.id) <
                      allExercises.length - 1
                      ? "Next Exercise →"
                      : "Complete Lesson ✓"
                    : "Continue"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          href={`/units/${unitId}/lessons/${lessonId}/exercises`}
          variant="outline"
        >
          ← Back to Exercises
        </Button>
        <Button href={`/units/${unitId}/lessons/${lessonId}`} variant="outline">
          Back to Lesson
        </Button>
      </div>
    </div>
  );
}
