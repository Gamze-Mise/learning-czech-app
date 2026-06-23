"use client";

import { use } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminDangerZone from "@/components/admin/AdminDangerZone";
import LessonMetadataForm from "@/components/admin/LessonMetadataForm";
import LessonSaveSuccessModal from "@/components/admin/LessonSaveSuccessModal";
import { useAdminLessonEditor } from "@/hooks/admin/useAdminLessonEditor";
import LessonPartsPanel from "./LessonPartsPanel";
import LessonFlashcardsPanel from "./LessonFlashcardsPanel";
import LessonExercisesPanel from "./LessonExercisesPanel";

export default function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const editor = useAdminLessonEditor(id);

  if (editor.loading) {
    return <p className="text-slate-600">Loading…</p>;
  }
  if (editor.loadError || !editor.lesson) {
    return (
      <div>
        <p className="text-red-600">{editor.loadError ?? "Not found"}</p>
        <Link href="/admin/lessons" className="text-blue-600">
          ← Back
        </Link>
      </div>
    );
  }

  const lesson = editor.lesson;

  return (
    <div className="max-w-4xl space-y-8">
      <LessonSaveSuccessModal
        open={editor.saveSuccessOpen}
        onClose={() => editor.setSaveSuccessOpen(false)}
      />

      <AdminPageHeader
        title="Edit lesson"
        description={`Unit: ${lesson.unit.title} (ID ${lesson.unitId})`}
        action={
          <Link href="/admin/lessons" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Back
          </Link>
        }
      />

      <LessonMetadataForm
        lesson={lesson}
        setLesson={editor.setLesson}
        saveError={editor.saveError}
        saving={editor.saving}
        onSubmit={editor.onSubmit}
      />

      <LessonPartsPanel
        parts={lesson.parts ?? []}
        busyPart={editor.busy === "part"}
        newPart={editor.newPart}
        setNewPart={editor.setNewPart}
        editingPartId={editor.editingPartId}
        partDraft={editor.partDraft}
        setPartDraft={editor.setPartDraft}
        onAddPart={editor.addPart}
        onDeactivatePart={editor.deactivatePart}
        onStartEditPart={editor.startEditPart}
        onSavePart={editor.savePart}
        onReorderPart={editor.reorderParts}
        onCancelEditPart={editor.cancelEditPart}
      />

      <LessonFlashcardsPanel
        flashcards={lesson.flashcards ?? []}
        busyCard={editor.busy === "card"}
        newCard={editor.newCard}
        setNewCard={editor.setNewCard}
        editingCardId={editor.editingCardId}
        cardDraft={editor.cardDraft}
        setCardDraft={editor.setCardDraft}
        onAddFlashcard={editor.addFlashcard}
        onDeactivateFlashcard={editor.deactivateFlashcard}
        onStartEditCard={editor.startEditCard}
        onSaveCard={editor.saveCard}
        onReorderFlashcard={editor.reorderFlashcards}
        onCancelEditCard={editor.cancelEditCard}
      />

      <LessonExercisesPanel
        exercises={lesson.exercises ?? []}
        busyEx={editor.busy === "ex"}
        newEx={editor.newEx}
        setNewEx={editor.setNewEx}
        editingExId={editor.editingExId}
        exDraft={editor.exDraft}
        setExDraft={editor.setExDraft}
        onAddExercise={editor.addExercise}
        onDeactivateExercise={editor.deactivateExercise}
        onStartEditExercise={editor.startEditExercise}
        onSaveExercise={editor.saveExercise}
        onReorderExercise={editor.reorderExercises}
        onCancelEditExercise={editor.cancelEditExercise}
      />

      <AdminDangerZone
        actionLabel="Deactivate lesson"
        onAction={editor.deactivateLesson}
      />
    </div>
  );
}
