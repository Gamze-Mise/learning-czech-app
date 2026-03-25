"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function ExercisesPage() {
  const params = useParams();
  const router = useRouter();
  const { id: unitId, lessonId } = params;

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);

  // Session state
  const [queue, setQueue] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [cycle, setCycle] = useState<1 | 2>(1);
  const wrongIdsRef = useRef<Set<number>>(new Set());
  const attemptsRef = useRef<Record<number, number>>({});

  // UI state (per exercise)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [matchingPairs, setMatchingPairs] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [lastMatchFeedback, setLastMatchFeedback] = useState<
    "correct" | "incorrect" | null
  >(null);
  const [shuffledRightItems, setShuffledRightItems] = useState<string[]>([]);

  // Feedback/modal
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    kind: "correct" | "wrong" | "reveal";
    correctAnswer?: string;
    explanation?: string | null;
  }>({ open: false, kind: "correct", correctAnswer: "", explanation: null });

  const [finishing, setFinishing] = useState(false);
  const [finished, setFinished] = useState(false);
  const [nextLesson, setNextLesson] = useState<any>(null);

  function shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

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
          router.replace(
            `/login?redirect=/units/${unitId}/lessons/${lessonId}/exercises`
          );
          return;
        }

        if (!lessonRes.ok) {
          setFatalError("Lesson could not be loaded.");
          return;
        }
        const data = await lessonRes.json();
        setLesson(data);

        const exercises = Array.isArray(data.exercises) ? data.exercises : [];
        const shuffled = shuffle(exercises);
        setQueue(shuffled);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, unitId]);

  // Reset per-exercise UI when the current item changes
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
      const rightItems: string[] = current.options.map((opt: any) => opt.right);
      setShuffledRightItems(shuffle(rightItems));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  function normalizeText(text: string): string {
    return String(text ?? "")
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "");
  }

  function isAnswerAcceptable(userText: string, correctText: string): boolean {
    const normalizedUser = normalizeText(userText);
    const normalizedCorrect = normalizeText(correctText);
    if (normalizedUser === normalizedCorrect) return true;
    const variations = [
      normalizedCorrect.replace(/\s+/g, ""),
      normalizedCorrect.replace(/\s+/g, " "),
    ];
    return variations.some((v) => normalizedUser === v);
  }

  function computeCorrect(): { correct: boolean; correctAnswer: string } {
    if (!current) return { correct: false, correctAnswer: "" };
    if (current.type === "MCQ") {
      const correctOption = (current.options ?? []).find(
        (opt: any) => opt.correct === true
      );
      const correctAnswer = correctOption?.text || current.answer || "";
      return { correct: selectedAnswer === correctAnswer, correctAnswer };
    }
    if (current.type === "FILL") {
      const correctAnswer = current.answer || "";
      return {
        correct: isAnswerAcceptable(userAnswer, correctAnswer),
        correctAnswer,
      };
    }
    if (current.type === "MATCHING") {
      const correctPairs = (current.options ?? []).length;
      const userPairs = Object.keys(matchingPairs).length;
      if (userPairs !== correctPairs) {
        return {
          correct: false,
          correctAnswer: `Match all ${correctPairs} pairs`,
        };
      }
      const correct = (current.options ?? []).every(
        (opt: any) => matchingPairs[opt.left] === opt.right
      );
      return { correct, correctAnswer: `${correctPairs} pairs` };
    }
    return { correct: false, correctAnswer: String(current.answer ?? "") };
  }

  async function saveResult(correct: boolean): Promise<void> {
    if (!current) return;
    const answer =
      current.type === "FILL"
        ? userAnswer
        : current.type === "MATCHING"
          ? JSON.stringify(matchingPairs)
          : selectedAnswer;

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
  }

  function goNext(): void {
    if (idx < queue.length - 1) {
      setIdx((p) => p + 1);
      return;
    }
    // End of current queue
    if (cycle === 1 && wrongIdsRef.current.size > 0) {
      const retry = shuffle(
        queue.filter((ex) => wrongIdsRef.current.has(Number(ex.id)))
      );
      wrongIdsRef.current = new Set();
      setQueue(retry);
      setIdx(0);
      setCycle(2);
      return;
    }
    void finishLesson();
  }

  async function finishLesson(): Promise<void> {
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
  }

  function handleLeftClick(leftItem: string) {
    if (selectedLeft === leftItem) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(leftItem);
    }
  }

  function handleRightClick(rightItem: string) {
    if (!selectedLeft) return;
    const isCorrectPair = (current?.options ?? []).some(
      (opt: any) => opt.left === selectedLeft && opt.right === rightItem
    );
    setMatchingPairs((prev) => ({ ...prev, [selectedLeft]: rightItem }));
    setLastMatchFeedback(isCorrectPair ? "correct" : "incorrect");
    setSelectedLeft(null);
  }

  function removePair(leftItem: string) {
    setMatchingPairs((prev) => {
      const next = { ...prev };
      delete next[leftItem];
      return next;
    });
    setSelectedLeft(leftItem);
    setLastMatchFeedback(null);
  }

  async function onSubmit(): Promise<void> {
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

    // Wrong
    if (attempts === 0) {
      wrongIdsRef.current.add(id);
      setFeedbackModal({ open: true, kind: "wrong" });
      return;
    }

    // Second wrong: reveal answer + explanation, Next only
    setFeedbackModal({
      open: true,
      kind: "reveal",
      correctAnswer,
      explanation: current.explanation ?? null,
    });
  }

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-slate-600 mt-4">Loading exercises…</p>
      </div>
    );
  }

  if (fatalError) {
    return (
      <div className="text-center py-10 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Exercises</h1>
        <p className="text-slate-600">{fatalError}</p>
        <Button href={`/units/${unitId}/lessons/${lessonId}`} variant="primary">
          Back
        </Button>
      </div>
    );
  }

  if (!lesson || !current) {
    return (
      <div className="text-center py-10 space-y-3">
        <h1 className="text-2xl font-bold text-slate-900">No exercises</h1>
        <p className="text-slate-600">This lesson has no exercises yet.</p>
        <Button href={`/units/${unitId}/lessons/${lessonId}`} variant="primary">
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Exercises: ${lesson.title}`}
        subtitle={
          finished
            ? "Session complete"
            : cycle === 1
              ? "First pass"
              : "Review wrong answers"
        }
        className="py-6"
      />

      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress.pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>
          {progress.current} / {progress.total}
        </span>
        <span>{cycle === 2 ? "Review" : "Session"}</span>
      </div>

      {finished ? (
        <Card>
          <div className="text-center space-y-3 py-4">
            <div className="text-4xl">🎉</div>
            <h2 className="text-xl font-bold text-slate-900">Done</h2>
            <p className="text-slate-600">
              {finishing ? "Saving progress…" : "Lesson progress saved."}
            </p>
            <div className="flex justify-center gap-3 pt-2">
              {nextLesson ? (
                <Button
                  onClick={() =>
                    router.push(`/units/${unitId}/lessons/${nextLesson.id}`)
                  }
                  variant="primary"
                >
                  Next lesson →
                </Button>
              ) : (
                <Button
                  onClick={() => router.push(`/units/${unitId}`)}
                  variant="primary"
                >
                  Back to unit
                </Button>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <p className="text-slate-900 text-lg font-semibold">
                {current.question}
              </p>
            </div>

            {current.type === "MCQ" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(current.options ?? []).map((option: any, i: number) => {
                  const optionText =
                    typeof option === "string" ? option : option.text;
                  const active = selectedAnswer === optionText;
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setSelectedAnswer(optionText)}
                      className={`p-4 rounded-xl border-2 text-left transition-colors ${
                        active
                          ? "border-indigo-500 bg-indigo-50 text-indigo-900 font-semibold"
                          : "border-slate-300 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-900 bg-white font-medium"
                      }`}
                    >
                      <span className="font-semibold mr-2">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {optionText}
                    </button>
                  );
                })}
              </div>
            )}

            {current.type === "FILL" && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full p-4 border-2 border-slate-300 rounded-xl focus:border-indigo-500 focus:outline-none text-lg text-slate-900 bg-white"
                  placeholder="Type your answer…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void onSubmit();
                  }}
                />
              </div>
            )}

            {current.type === "MATCHING" && Array.isArray(current.options) && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h5 className="text-sm font-semibold text-slate-600">
                      🇨🇿 Czech
                    </h5>
                    {current.options.map((opt: any, i: number) => {
                      const leftItem = opt.left;
                      const isSelected = selectedLeft === leftItem;
                      const matchedRight = matchingPairs[leftItem];
                      const isMatched = !!matchedRight;
                      const isCorrectMatch =
                        isMatched &&
                        current.options.some(
                          (o: any) =>
                            o.left === leftItem && o.right === matchedRight
                        );
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleLeftClick(leftItem)}
                          disabled={isCorrectMatch}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            isCorrectMatch
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900 cursor-not-allowed font-semibold"
                              : isMatched
                                ? "bg-rose-50 border-rose-300 text-rose-900 font-semibold"
                                : isSelected
                                  ? "bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold"
                                  : "bg-white border-slate-300 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-900 font-medium"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{leftItem}</span>
                            {isMatched && (
                              <span className="text-xs text-slate-600 font-semibold">
                                → {matchedRight}{" "}
                                <span
                                  className="ml-2 text-rose-600 hover:text-rose-800 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removePair(leftItem);
                                  }}
                                >
                                  ✕
                                </span>
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-semibold text-slate-600">
                      🇺🇸 English
                    </h5>
                    {(shuffledRightItems.length
                      ? shuffledRightItems
                      : current.options.map((o: any) => o.right)
                    ).map((rightItem: string, i: number) => {
                      const matchedEntry = Object.entries(matchingPairs).find(
                        ([, value]) => value === rightItem
                      );
                      const isUsed = !!matchedEntry;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleRightClick(rightItem)}
                          disabled={!selectedLeft || isUsed}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            isUsed
                              ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed font-semibold"
                              : selectedLeft
                                ? "bg-emerald-50 border-emerald-300 hover:bg-emerald-100 text-slate-900 font-medium"
                                : "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                          }`}
                        >
                          <span>{rightItem}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="text-xs text-slate-600">
                  {Object.keys(matchingPairs).length} / {current.options.length}{" "}
                  pairs
                  {lastMatchFeedback === "correct" ? " • ✓" : ""}
                  {lastMatchFeedback === "incorrect" ? " • ✗" : ""}
                </div>
              </div>
            )}

            <div className="flex justify-center pt-2">
              <Button
                onClick={() => void onSubmit()}
                variant="primary"
                size="lg"
                disabled={
                  (current.type === "MCQ" && !selectedAnswer) ||
                  (current.type === "FILL" && !userAnswer.trim()) ||
                  (current.type === "MATCHING" &&
                    Object.keys(matchingPairs).length !==
                      (current.options ?? []).length)
                }
              >
                Check
              </Button>
            </div>
          </div>
        </Card>
      )}

      {feedbackModal.open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

          <div className="relative w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
            <div
              className={`px-5 sm:px-6 py-4 border-b ${
                feedbackModal.kind === "correct"
                  ? "bg-gradient-to-r from-emerald-50 to-emerald-100/40 border-emerald-200"
                  : feedbackModal.kind === "reveal"
                    ? "bg-gradient-to-r from-indigo-50 to-indigo-100/40 border-indigo-200"
                    : "bg-gradient-to-r from-rose-50 to-rose-100/40 border-rose-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                      feedbackModal.kind === "correct"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : feedbackModal.kind === "reveal"
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : "bg-rose-50 border-rose-200 text-rose-700"
                    }`}
                  >
                    <span className="text-xl">
                      {feedbackModal.kind === "correct"
                        ? "✓"
                        : feedbackModal.kind === "reveal"
                          ? "💡"
                          : "✕"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                      {feedbackModal.kind === "correct"
                        ? "Correct"
                        : feedbackModal.kind === "wrong"
                          ? "Try again later"
                          : "Answer"}
                    </h3>
                    <p className="text-sm text-slate-700">
                      {feedbackModal.kind === "correct"
                        ? `+${current.points ?? 0} XP`
                        : feedbackModal.kind === "wrong"
                          ? cycle === 2
                            ? "Second attempt"
                            : "You’ll see this one again"
                          : "Second wrong — here’s the solution"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-600">
                    {cycle === 2 ? "Review" : "Session"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {progress.current} / {progress.total}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-3">
              {feedbackModal.kind === "reveal" ? (
                <>
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="text-xs font-semibold text-emerald-700">
                      Correct answer
                    </div>
                    <div className="text-lg font-extrabold text-emerald-800 mt-1">
                      {feedbackModal.correctAnswer}
                    </div>
                  </div>
                  {feedbackModal.explanation ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs font-semibold text-slate-600">
                        Explanation
                      </div>
                      <div className="text-sm text-slate-800 mt-1 leading-relaxed">
                        {feedbackModal.explanation}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-slate-700">
                  {feedbackModal.kind === "correct"
                    ? "Nice. Keep going."
                    : "No worries — you’ll get another chance at the end."}
                </p>
              )}
            </div>

            <div className="px-5 sm:px-6 py-4 border-t border-slate-200 bg-white">
              <Button
                onClick={() => {
                  setFeedbackModal({
                    open: false,
                    kind: "correct",
                    correctAnswer: "",
                    explanation: null,
                  });
                  goNext();
                }}
                variant="primary"
                className={`w-full !rounded-2xl !font-semibold !py-3 shadow-sm ${
                  feedbackModal.kind === "correct"
                    ? "!bg-emerald-600 hover:!bg-emerald-700"
                    : feedbackModal.kind === "reveal"
                      ? "!bg-indigo-600 hover:!bg-indigo-700"
                      : "!bg-rose-600 hover:!bg-rose-700"
                }`}
              >
                Next →
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
