import { useCallback, useState } from "react";

export function useAdminDraggableReorder() {
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const getDragHandlers = useCallback(
    (
      itemId: number,
      index: number,
      canDrag: boolean,
      onReorder: (draggedId: number, targetIndex: number) => void
    ) => ({
      draggable: canDrag,
      onDragStart: () => setDraggingId(itemId),
      onDragEnd: () => setDraggingId(null),
      onDragOver: (e: React.DragEvent) => {
        if (draggingId == null || draggingId === itemId) return;
        e.preventDefault();
      },
      onDrop: (e: React.DragEvent) => {
        if (draggingId == null || draggingId === itemId) return;
        e.preventDefault();
        onReorder(draggingId, index);
        setDraggingId(null);
      },
    }),
    [draggingId]
  );

  return { draggingId, getDragHandlers };
}
