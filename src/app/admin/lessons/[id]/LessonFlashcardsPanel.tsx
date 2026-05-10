"use client";

import AdminImageField from "@/components/admin/AdminImageField";
import AdminAudioField from "@/components/admin/AdminAudioField";
import { useState } from "react";

export type NewCardState = {
  frontText: string;
  backText: string;
  imageUrl: string;
  audioUrl: string;
  example: string;
  difficulty: string;
  category: string;
};

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
  const [draggingId, setDraggingId] = useState<number | null>(null);

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
            draggable={editingCardId == null}
            onDragStart={() => setDraggingId(c.id)}
            onDragEnd={() => setDraggingId(null)}
            onDragOver={(e) => {
              if (draggingId == null || draggingId === c.id) return;
              e.preventDefault();
            }}
            onDrop={(e) => {
              if (draggingId == null || draggingId === c.id) return;
              e.preventDefault();
              onReorderFlashcard(draggingId, index);
              setDraggingId(null);
            }}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
          >
            {editingCardId === c.id && cardDraft ? (
              <div className="w-full space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-600">
                    #{index + 1}
                  </div>
                  <input
                    value={cardDraft.difficulty}
                    onChange={(e) => setCardDraft({ ...cardDraft, difficulty: e.target.value })}
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                  />
                  <input
                    value={cardDraft.category}
                    onChange={(e) => setCardDraft({ ...cardDraft, category: e.target.value })}
                    placeholder="category"
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                  />
                </div>
                <input
                  value={cardDraft.frontText}
                  onChange={(e) => setCardDraft({ ...cardDraft, frontText: e.target.value })}
                  placeholder="Front"
                  className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                />
                <input
                  value={cardDraft.backText}
                  onChange={(e) => setCardDraft({ ...cardDraft, backText: e.target.value })}
                  placeholder="Back"
                  className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                />
                <AdminImageField
                  compact
                  label="Image"
                  value={cardDraft.imageUrl ?? ""}
                  onChange={(v) => setCardDraft({ ...cardDraft, imageUrl: v })}
                  description="URL or upload; shown on the learner card when set."
                  enableFileUpload
                />
                <AdminAudioField
                  compact
                  label="Audio"
                  value={cardDraft.audioUrl ?? ""}
                  onChange={(v) => setCardDraft({ ...cardDraft, audioUrl: v })}
                  enableFileUpload
                />
                <input
                  value={cardDraft.example}
                  onChange={(e) => setCardDraft({ ...cardDraft, example: e.target.value })}
                  placeholder="Example"
                  className="w-full rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900"
                />
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={cardDraft.isActive}
                    onChange={(e) => setCardDraft({ ...cardDraft, isActive: e.target.checked })}
                  />
                  Active
                </label>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onCancelEditCard}
                    className="text-xs font-semibold text-slate-600 hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={busyCard}
                    onClick={() => onSaveCard(c.id)}
                    className="text-xs font-semibold text-indigo-700 hover:underline"
                  >
                    Save
                  </button>
                </div>
              </div>
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
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={busyCard}
                    onClick={() => onStartEditCard(c)}
                    className="text-xs font-semibold text-indigo-700 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={busyCard}
                    onClick={() => onDeactivateFlashcard(c.id)}
                    className="text-xs font-semibold text-rose-700 hover:underline"
                  >
                    Deactivate
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {flashcards.length === 0 && <p className="text-sm text-slate-500">No flashcards yet.</p>}
      </div>

      <form onSubmit={onAddFlashcard} className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Difficulty</label>
          <input
            value={newCard.difficulty}
            onChange={(e) => setNewCard({ ...newCard, difficulty: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Front *</label>
          <input
            required
            value={newCard.frontText}
            onChange={(e) => setNewCard({ ...newCard, frontText: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Back *</label>
          <input
            required
            value={newCard.backText}
            onChange={(e) => setNewCard({ ...newCard, backText: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-700">Example</label>
          <input
            value={newCard.example}
            onChange={(e) => setNewCard({ ...newCard, example: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div className="md:col-span-2">
          <AdminImageField
            compact
            label="Image"
            value={newCard.imageUrl}
            onChange={(v) => setNewCard({ ...newCard, imageUrl: v })}
            enableFileUpload
          />
        </div>
        <div className="md:col-span-2">
          <AdminAudioField
            label="Audio"
            value={newCard.audioUrl}
            onChange={(v) => setNewCard({ ...newCard, audioUrl: v })}
            enableFileUpload
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-700">Category</label>
          <input
            value={newCard.category}
            onChange={(e) => setNewCard({ ...newCard, category: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={busyCard}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {busyCard ? "Saving…" : "Add flashcard"}
          </button>
        </div>
      </form>
    </div>
  );
}
