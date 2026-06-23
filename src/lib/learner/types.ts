export type LearnerFlashcard = {
  id: number;
  frontText: string;
  backText: string;
  audioUrl: string | null;
  imageUrl: string | null;
  example: string | null;
  difficulty: number;
  category: string;
};

export type LessonPart = {
  id: number;
  title: string;
  type: string;
  duration?: number | null;
  content?: { markdown?: string } | null;
  audioUrl?: string | null;
  videoUrl?: string | null;
};

export type LessonDetail = {
  id: number;
  title: string;
  description?: string | null;
  difficulty: number;
  estimatedTime?: number | null;
  thumbnail?: string | null;
  parts: LessonPart[];
  flashcards: LearnerFlashcard[];
  exercises: unknown[];
};

export type LessonSummary = {
  id: number;
  title: string;
  description: string;
  type: string;
  thumbnail?: string | null;
  estimatedTime: number;
  progress: number;
  isCompleted: boolean;
  exerciseProgress: number;
  completedExercises: number;
  totalExercises: number;
  flashcards: LearnerFlashcard[];
  exercises: unknown[];
};

export type UnitWithProgress = {
  id: number;
  title: string;
  description: string;
  level: number;
  thumbnail?: string | null;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lessons: LessonSummary[];
};
