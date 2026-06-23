"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { shuffleArray } from "@/lib/array/shuffle";
import { getEffectiveExerciseType } from "@/lib/exercises/runtime";
import {
  computeExerciseCorrect,
  serializeExerciseAnswer,
} from "@/lib/exercises/scoring";

export type ExerciseFeedbackKind = "correct" | "wrong" | "reveal";

export type ExerciseFeedbackModalState = {
  open: boolean;
  kind: ExerciseFeedbackKind;
  correctAnswer?: string;
  explanation?: string | null;
};

type LessonExercise = {
  id: number;
  type: string;
  question: string;
  options?: Array<{ text?: string; correct?: boolean; left?: string; right?: string }>;
  answer?: string | null;
  explanation?: string | null;
  points?: number;
  imageUrl?: string | null;
  audioUrl?: string | null;
};

export function useExerciseSession(unitId: string, lessonId: string) {
  const router = useRouter();
  const [lesson, setLesson] = useState<{ title: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);

  const [queue, setQueue] = useState<LessonExercise[]>([]);
  const [idx, setIdx] = useState(0);
  const [cycle, setCycle] = useState<1 | 2>(1);
  const wrongIdsRef = useRef<Set<number>>(new Set());
  const attemptsRef = useRef<Record<number, number>>({});

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [matchingPairs, setMatchingPairs] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [lastMatchFeedback, setLastMatchFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [shuffledRightItems, setShuffledRightItems] = useState<string[]>([]);

  const [feedbackModal, setFeedbackModal] = useState<ExerciseFeedbackModalState>({
    open: false,
    kind: "correct",
    correctAnswer: "",
    explanation: null,
  });

  const [finishing, setFinishing] = useState(false);
  const [finished, setFinished] = useState(false);
  const [nextLesson, setNextLesson] = useState<{ id: number } | null>(null);

  const current = queue[idx];

  const progress = useMemo(() => {
    const total = queue.length || 1;
    const currentN = Math.min(idx + 1, total);
    return {
      total,
      current: currentN,
      pct: Math.round((currentN / total) * 100),
    };
  }, [idx, queue.length]);

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        setFatalError(null);
        const [meRes, lessonRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch(`/api/lessons/${lessonId}`),
        ]);
        const meData = await meRes.json();
        if (!meRes.ok || !meData.user) {
          router.replace(`/login?redirect=/units/${unitId}/lessons/${lessonId}/exercises`);
          return;
        }

        if (!lessonRes.ok) {
          setFatalError("Lesson could not be loaded.");
          return;
        }
        const data = await lessonRes.json();
        setLesson(data);

        const exercises = Array.isArray(data.exercises) ? data.exercises : [];
        setQueue(shuffleArray(exercises));
        setIdx(0);
        setCycle(1);
        wrongIdsRef.current = new Set();
        attemptsRef.current = {};
        setFinished(false);
        setNextLesson(null);
      } catch {
        setFatalError("Something went wrong. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [lessonId, unitId, router]);

  useEffect(() => {
    setSelectedAnswer("");
    setUserAnswer("");
    setMatchingPairs({});
    setSelectedLeft(null);
    setLastMatchFeedback(null);
    setShuffledRightItems([]);
    setFeedbackModal({
      open: false,
      kind: "correct",
      correctAnswer: "",
      explanation: null,
    });

    if (current?.type === "MATCHING" && Array.isArray(current.options)) {
      const rightItems: string[] = current.options.map((opt) => opt.right ?? "");
      setShuffledRightItems(shuffleArray(rightItems));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  const canSubmit = useMemo(() => {
    if (!current) return false;
    const effectiveType = getEffectiveExerciseType(current.type);
    if (effectiveType === "MCQ") return Boolean(selectedAnswer);
    if (effectiveType === "FILL") return Boolean(userAnswer.trim());
    if (current.type === "MATCHING") {
      return Object.keys(matchingPairs).length === (current.options ?? []).length;
    }
    return false;
  }, [current, selectedAnswer, userAnswer, matchingPairs]);

  const computeCorrect = useCallback(() => {
    if (!current) return { correct: false, correctAnswer: "" };
    return computeExerciseCorrect(current, {
      selectedAnswer,
      userAnswer,
      matchingPairs,
    });
  }, [current, selectedAnswer, userAnswer, matchingPairs]);

  const saveResult = useCallback(
    async (correct: boolean) => {
      if (!current) return;
      const answer = serializeExerciseAnswer(current, {
        selectedAnswer,
        userAnswer,
        matchingPairs,
      });

      await fetch("/api/exercises/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: current.id,
          correct,
          answer,
          timeSpent: null,
        }),
      });
    },
    [current, selectedAnswer, userAnswer, matchingPairs]
  );

  const finishLesson = useCallback(async () => {
    if (finishing || finished) return;
    setFinishing(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setNextLesson(data.nextLesson ?? null);
      }
    } finally {
      setFinished(true);
      setFinishing(false);
    }
  }, [finishing, finished, lessonId]);

  const goNext = useCallback(() => {
    if (idx < queue.length - 1) {
      setIdx((p) => p + 1);
      return;
    }
    if (cycle === 1 && wrongIdsRef.current.size > 0) {
      const retry = shuffleArray(
        queue.filter((ex) => wrongIdsRef.current.has(Number(ex.id)))
      );
      wrongIdsRef.current = new Set();
      setQueue(retry);
      setIdx(0);
      setCycle(2);
      return;
    }
    void finishLesson();
  }, [idx, queue, cycle, finishLesson]);

  const handleLeftClick = useCallback((leftItem: string) => {
    setSelectedLeft((prev) => (prev === leftItem ? null : leftItem));
  }, []);

  const handleRightClick = useCallback(
    (rightItem: string) => {
      if (!selectedLeft || !current) return;
      const isCorrectPair = (current.options ?? []).some(
        (opt) => opt.left === selectedLeft && opt.right === rightItem
      );
      setMatchingPairs((prev) => ({ ...prev, [selectedLeft]: rightItem }));
      setLastMatchFeedback(isCorrectPair ? "correct" : "incorrect");
      setSelectedLeft(null);
    },
    [selectedLeft, current]
  );

  const removePair = useCallback((leftItem: string) => {
    setMatchingPairs((prev) => {
      const next = { ...prev };
      delete next[leftItem];
      return next;
    });
    setSelectedLeft(leftItem);
    setLastMatchFeedback(null);
  }, []);

  const onSubmit = useCallback(async () => {
    if (!current) return;
    const { correct, correctAnswer } = computeCorrect();
    const id = Number(current.id);
    const attempts = attemptsRef.current[id] ?? 0;
    attemptsRef.current[id] = attempts + 1;

    void saveResult(correct);

    if (correct) {
      setFeedbackModal({ open: true, kind: "correct" });
      return;
    }

    if (attempts === 0) {
      wrongIdsRef.current.add(id);
      setFeedbackModal({ open: true, kind: "wrong" });
      return;
    }

    setFeedbackModal({
      open: true,
      kind: "reveal",
      correctAnswer,
      explanation: current.explanation ?? null,
    });
  }, [current, computeCorrect, saveResult]);

  const closeFeedbackAndNext = useCallback(() => {
    setFeedbackModal({
      open: false,
      kind: "correct",
      correctAnswer: "",
      explanation: null,
    });
    goNext();
  }, [goNext]);

  return {
    lesson,
    loading,
    fatalError,
    current,
    progress,
    cycle,
    finished,
    finishing,
    nextLesson,
    selectedAnswer,
    setSelectedAnswer,
    userAnswer,
    setUserAnswer,
    matchingPairs,
    shuffledRightItems,
    selectedLeft,
    lastMatchFeedback,
    feedbackModal,
    handleLeftClick,
    handleRightClick,
    removePair,
    onSubmit,
    closeFeedbackAndNext,
    canSubmit,
    goToNextLesson: (nextId: number) => router.push(`/units/${unitId}/lessons/${nextId}`),
    goToUnit: () => router.push(`/units/${unitId}`),
  };
}
