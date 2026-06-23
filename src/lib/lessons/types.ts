export type LessonDetail = {
  id: number;
  unitId: number;
  title: string;
  order: number;
  description: string | null;
  type: string;
  difficulty: number;
  estimatedTime: number | null;
  isActive: boolean;
  thumbnail: string | null;
  unit: { id: number; title: string };
  parts?: Array<Record<string, unknown>>;
  flashcards?: Array<Record<string, unknown>>;
  exercises?: Array<Record<string, unknown>>;
};
