export const NEW_LESSON_TITLE_MAX = 200;
export const NEW_LESSON_THUMB_MAX = 2000;

export type NewLessonFieldErrors = {
  unitId?: string;
  title?: string;
  difficulty?: string;
  estimatedTime?: string;
  thumbnail?: string;
};

export function validateNewLessonFields(input: {
  unitId: string;
  title: string;
  difficulty: string;
  estimatedTime: string;
  thumbnail: string;
}): NewLessonFieldErrors {
  const err: NewLessonFieldErrors = {};
  if (!input.unitId.trim()) {
    err.unitId = "Choose a unit for this lesson.";
  }
  const t = input.title.trim();
  if (!t) {
    err.title = "Title is required.";
  } else if (t.length > NEW_LESSON_TITLE_MAX) {
    err.title = `Title must be at most ${NEW_LESSON_TITLE_MAX} characters.`;
  }
  const d = Number(input.difficulty);
  if (!Number.isFinite(d) || !Number.isInteger(d) || d < 1 || d > 5) {
    err.difficulty = "Difficulty must be a whole number from 1 to 5.";
  }
  if (input.estimatedTime.trim()) {
    const et = Number(input.estimatedTime);
    if (!Number.isFinite(et) || !Number.isInteger(et) || et < 0) {
      err.estimatedTime =
        "Estimated time must be a whole number of minutes (0 or greater).";
    }
  }
  const th = input.thumbnail.trim();
  if (th.length > NEW_LESSON_THUMB_MAX) {
    err.thumbnail = `URL or path is too long (max ${NEW_LESSON_THUMB_MAX} characters).`;
  }
  return err;
}
