"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { devError } from "@/lib/logger";
import type { LearnerFlashcard } from "@/lib/learner/types";
import { useRequireLearner } from "./useRequireLearner";

export function useFlashcardSession(unitId: string, lessonId: string) {
  const redirectPath = `/units/${unitId}/lessons/${lessonId}/flashcards`;
  const { userId, checking } = useRequireLearner(redirectPath);

  const [flashcards, setFlashcards] = useState<LearnerFlashcard[]>([]);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionRatings, setSessionRatings] = useState<
    { index: number; result: "known" | "unknown" }[]
  >([]);
  const cardSeenAtRef = useRef<number | null>(null);

  const loadFlashcards = useCallback(async () => {
    if (userId == null) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/flashcards/${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setFlashcards(data.flashcards || []);
        setExerciseCount(
          typeof data.exerciseCount === "number" ? data.exerciseCount : 0
        );
      }
    } catch (error) {
      devError("Error loading flashcards:", error);
    } finally {
      setLoading(false);
    }
  }, [lessonId, userId]);

  useEffect(() => {
    if (userId != null) void loadFlashcards();
  }, [userId, loadFlashcards]);

  const handleFlip = () => {
    if (!isFlipped) cardSeenAtRef.current = Date.now();
    setIsFlipped((prev) => !prev);
  };

  const studyTimeSeconds = () => {
    if (!cardSeenAtRef.current) return 0;
    return Math.round((Date.now() - cardSeenAtRef.current) / 1000);
  };

  const reportProgress = async (result: "known" | "unknown") => {
    const card = flashcards[currentIndex];
    if (!card || savingProgress || userId == null) return;
    setSavingProgress(true);
    try {
      await fetch("/api/flashcards/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          flashcardId: card.id,
          result,
          studyTimeSeconds: studyTimeSeconds(),
        }),
      });
    } catch (e) {
      devError("Error saving flashcard progress:", e);
    } finally {
      setSavingProgress(false);
    }
  };

  const advanceAfterRating = async (result: "known" | "unknown") => {
    await reportProgress(result);
    setSessionRatings((prev) => {
      const filtered = prev.filter((r) => r.index !== currentIndex);
      return [...filtered, { index: currentIndex, result }];
    });
    const isLast = currentIndex === flashcards.length - 1;
    if (isLast) {
      setIsComplete(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setIsFlipped(false);
    cardSeenAtRef.current = null;
  };

  const handleKnown = async () => {
    if (!isFlipped) return;
    await advanceAfterRating("known");
  };

  const handleUnknown = async () => {
    if (!isFlipped) return;
    await advanceAfterRating("unknown");
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      cardSeenAtRef.current = null;
      setIsComplete(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      cardSeenAtRef.current = null;
      setIsComplete(false);
    }
  };

  const jumpToIndex = (index: number) => {
    setCurrentIndex(index);
    setIsFlipped(false);
    cardSeenAtRef.current = null;
    setIsComplete(false);
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    cardSeenAtRef.current = null;
    setIsComplete(false);
    setSessionRatings([]);
  };

  const currentCard = flashcards[currentIndex];
  const knownCount = sessionRatings.filter((r) => r.result === "known").length;
  const againCount = sessionRatings.filter((r) => r.result === "unknown").length;

  return {
    checking,
    loading: checking || loading,
    flashcards,
    exerciseCount,
    currentCard,
    currentIndex,
    isFlipped,
    savingProgress,
    isComplete,
    sessionRatings,
    knownCount,
    againCount,
    handleFlip,
    handleKnown,
    handleUnknown,
    handleNext,
    handlePrevious,
    jumpToIndex,
    restartSession,
  };
}
