"use client";

import { useParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import ExerciseProgressBar from "@/components/exercises/ExerciseProgressBar";
import ExerciseFinishedCard from "@/components/exercises/ExerciseFinishedCard";
import ExerciseMediaBlock from "@/components/exercises/ExerciseMediaBlock";
import ExerciseMcqChoices from "@/components/exercises/ExerciseMcqChoices";
import ExerciseFillInput from "@/components/exercises/ExerciseFillInput";
import ExerciseMatchingBoard from "@/components/exercises/ExerciseMatchingBoard";
import ExerciseFeedbackModal from "@/components/exercises/ExerciseFeedbackModal";
import { useExerciseSession } from "@/hooks/learner/useExerciseSession";
import { getEffectiveExerciseType } from "@/lib/exercises/runtime";

export default function ExercisesPage() {
  const params = useParams();
  const unitId = String(params.id);
  const lessonId = String(params.lessonId);
  const session = useExerciseSession(unitId, lessonId);

  if (session.loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-slate-600 mt-4">Loading exercises…</p>
      </div>
    );
  }

  if (session.fatalError) {
    return (
      <div className="text-center py-10 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Exercises</h1>
        <p className="text-slate-600">{session.fatalError}</p>
        <Button href={`/units/${unitId}/lessons/${lessonId}`} variant="primary">
          Back
        </Button>
      </div>
    );
  }

  if (!session.lesson || !session.current) {
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

  const current = session.current;
  const effectiveType = getEffectiveExerciseType(current.type);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Exercises: ${session.lesson.title}`}
        subtitle={
          session.finished
            ? "Session complete"
            : session.cycle === 1
              ? "First pass"
              : "Review wrong answers"
        }
        className="py-6"
      />

      <ExerciseProgressBar
        pct={session.progress.pct}
        current={session.progress.current}
        total={session.progress.total}
        cycle={session.cycle}
      />

      {session.finished ? (
        <ExerciseFinishedCard
          finishing={session.finishing}
          nextLesson={session.nextLesson}
          onNextLesson={() => {
            if (session.nextLesson) session.goToNextLesson(session.nextLesson.id);
          }}
          onBackToUnit={session.goToUnit}
        />
      ) : (
        <Card>
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <p className="text-slate-900 text-lg font-semibold">{current.question}</p>
            </div>

            <ExerciseMediaBlock imageUrl={current.imageUrl} audioUrl={current.audioUrl} />

            {effectiveType === "MCQ" ? (
              <ExerciseMcqChoices
                options={current.options ?? []}
                selectedAnswer={session.selectedAnswer}
                onSelect={session.setSelectedAnswer}
              />
            ) : null}

            {effectiveType === "FILL" ? (
              <ExerciseFillInput
                value={session.userAnswer}
                onChange={session.setUserAnswer}
                onSubmit={() => void session.onSubmit()}
              />
            ) : null}

            {current.type === "MATCHING" && Array.isArray(current.options) ? (
              <ExerciseMatchingBoard
                options={current.options}
                matchingPairs={session.matchingPairs}
                selectedLeft={session.selectedLeft}
                shuffledRightItems={session.shuffledRightItems}
                lastMatchFeedback={session.lastMatchFeedback}
                onLeftClick={session.handleLeftClick}
                onRightClick={session.handleRightClick}
                onRemovePair={session.removePair}
              />
            ) : null}

            <div className="flex justify-center pt-2">
              <Button
                onClick={() => void session.onSubmit()}
                variant="primary"
                size="lg"
                disabled={!session.canSubmit}
              >
                Check
              </Button>
            </div>
          </div>
        </Card>
      )}

      <ExerciseFeedbackModal
        modal={session.feedbackModal}
        cycle={session.cycle}
        progress={session.progress}
        points={current.points ?? 0}
        onNext={session.closeFeedbackAndNext}
      />
    </div>
  );
}
