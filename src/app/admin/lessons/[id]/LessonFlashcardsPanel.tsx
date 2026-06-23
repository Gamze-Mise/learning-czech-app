"use client";

import FlashcardEditForm from "@/components/admin/FlashcardEditForm";
import FlashcardAddForm from "@/components/admin/FlashcardAddForm";
import AdminInlineListActions from "@/components/admin/AdminInlineListActions";
import { useAdminDraggableReorder } from "@/hooks/admin/useAdminDraggableReorder";
import type { NewCardState } from "@/lib/lessons/admin-form-types";

export type { NewCardState };

type Props = {
  flashcards: any[];
  busyCard: boolean;
  newCard: NewCardState;
  setNewCard: React.Dispatch<React.SetStateAction<NewCardState>>;
  editingCardId: number | null;
  cardDraft: any | null;
  setCardDraft: React.Dispatch<React.SetStateAction<any | null>>;
  onAddFlashcard: (e: React.FormEvent) => void;
  onDeactivateFlashcard: (id: number) => void;
  onStartEditCard: (card: any) => void;
  onSaveCard: (id: number) => void;
  onCancelEditCard: () => void;
  onReorderFlashcard: (flashcardId: number, targetIndex: number) => void;
};

export default function LessonFlashcardsPanel({
  flashcards,
  busyCard,
  newCard,
  setNewCard,
  editingCardId,
  cardDraft,
  setCardDraft,
  onAddFlashcard,
  onDeactivateFlashcard,
  onStartEditCard,
  onSaveCard,
  onCancelEditCard,
  onReorderFlashcard,
}: Props) {
  const { getDragHandlers } = useAdminDraggableReorder();

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Flashcards</h2>
          <p className="text-sm text-slate-600">Front/back + optional image/audio.</p>
        </div>
        <span className="text-sm text-slate-500">{flashcards.length} total</span>
      </div>

      <div className="space-y-2">
        {flashcards.map((c: any, index: number) => (
          <div
            key={c.id}
            {...getDragHandlers(c.id, index, editingCardId == null, onReorderFlashcard)}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
          >
            {editingCardId === c.id && cardDraft ? (
              <FlashcardEditForm
                index={index}
                draft={cardDraft}
                busy={busyCard}
                onChange={(next) => setCardDraft(next)}
                onSave={() => onSaveCard(c.id)}
                onCancel={onCancelEditCard}
              />
            ) : (
              <>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">
                    <span className="mr-2 inline-flex select-none items-center text-slate-400" aria-hidden>
                      ⋮⋮
                    </span>
                    {index + 1}. {c.frontText} → {c.backText}
                  </div>
                  <div className="text-xs text-slate-600">
                    {c.imageUrl ? "image " : ""}
                    {c.audioUrl ? "audio " : ""}
                    {!c.isActive ? "• Inactive" : ""}
                  </div>
                </div>
                <AdminInlineListActions
                  busy={busyCard}
                  onEdit={() => onStartEditCard(c)}
                  onDeactivate={() => onDeactivateFlashcard(c.id)}
                />
              </>
            )}
          </div>
        ))}
        {flashcards.length === 0 && <p className="text-sm text-slate-500">No flashcards yet.</p>}
      </div>

      <FlashcardAddForm
        value={newCard}
        onChange={setNewCard}
        busy={busyCard}
        onSubmit={onAddFlashcard}
      />
    </div>
  );
}
