type LessonChildResource = "parts" | "flashcards" | "exercises";

export async function persistLessonItemOrder(
  lessonId: number,
  resource: LessonChildResource,
  items: Array<{ id: number }>
): Promise<void> {
  for (let i = 0; i < items.length; i++) {
    await fetch(`/api/admin/lessons/${lessonId}/${resource}/${items[i].id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: i + 1 }),
    });
  }
}
