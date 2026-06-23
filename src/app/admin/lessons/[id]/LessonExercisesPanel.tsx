"use client";

import ExerciseEditForm from "@/components/admin/ExerciseEditForm";
import ExerciseAddForm from "@/components/admin/ExerciseAddForm";
import AdminInlineListActions from "@/components/admin/AdminInlineListActions";
import { useAdminDraggableReorder } from "@/hooks/admin/useAdminDraggableReorder";
import type { NewExState } from "@/lib/lessons/admin-form-types";

export type { NewExState };

type Props = {
  exercises: any[];
  busyEx: boolean;
  newEx: NewExState;
  setNewEx: React.Dispatch<React.SetStateAction<NewExState>>;
  editingExId: number | null;
  exDraft: any | null;
  setExDraft: React.Dispatch<React.SetStateAction<any | null>>;
  onAddExercise: (e: React.FormEvent) => void;
  onDeactivateExercise: (id: number) => void;
  onStartEditExercise: (ex: any) => void;
  onSaveExercise: (id: number) => void;
  onCancelEditExercise: () => void;
  onReorderExercise: (exerciseId: number, targetIndex: number) => void;
};

export default function LessonExercisesPanel({
  exercises,
  busyEx,
  newEx,
  setNewEx,
  editingExId,
  exDraft,
  setExDraft,
  onAddExercise,
  onDeactivateExercise,
  onStartEditExercise,
  onSaveExercise,
  onCancelEditExercise,
  onReorderExercise,
}: Props) {
  const { getDragHandlers } = useAdminDraggableReorder();

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Exercises</h2>
          <p className="text-sm text-slate-600">
            Add exercises with images/audio; options are edited with a simple UI.
          </p>
        </div>
        <span className="text-sm text-slate-500">{exercises.length} total</span>
      </div>

      <div className="space-y-2">
        {exercises.map((ex: any, index: number) => (
          <div
            key={ex.id}
            {...getDragHandlers(ex.id, index, editingExId == null, onReorderExercise)}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
          >
            {editingExId === ex.id && exDraft ? (
              <ExerciseEditForm
                index={index}
                draft={exDraft}
                busy={busyEx}
                onChange={(next) => setExDraft(next)}
                onSave={() => onSaveExercise(ex.id)}
                onCancel={onCancelEditExercise}
              />
            ) : (
              <>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">
                    <span className="mr-2 inline-flex select-none items-center text-slate-400" aria-hidden>
                      ⋮⋮
                    </span>
                    {index + 1}. [{ex.type}] {ex.question}
                  </div>
                  <div className="text-xs text-slate-600">
                    {ex.points} XP • diff {ex.difficulty}{" "}
                    {ex.timeLimit ? `• ${ex.timeLimit}s` : ""}{" "}
                    {!ex.isActive ? "• Inactive" : ""}
                  </div>
                </div>
                <AdminInlineListActions
                  busy={busyEx}
                  onEdit={() => onStartEditExercise(ex)}
                  onDeactivate={() => onDeactivateExercise(ex.id)}
                />
              </>
            )}
          </div>
        ))}
        {exercises.length === 0 && <p className="text-sm text-slate-500">No exercises yet.</p>}
      </div>

      <ExerciseAddForm
        value={newEx}
        onChange={setNewEx}
        busy={busyEx}
        onSubmit={onAddExercise}
      />
    </div>
  );
}
