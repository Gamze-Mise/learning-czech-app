/** Reorder an array by moving the item with `itemId` to `targetIndex`. */
export function reorderById<T extends { id: number }>(
  items: T[],
  itemId: number,
  targetIndex: number
): T[] {
  const fromIndex = items.findIndex((item) => item.id === itemId);
  if (fromIndex < 0) return items;

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(Math.max(0, Math.min(targetIndex, next.length)), 0, moved);
  return next;
}
