export type UnitDetail = {
  id: number;
  title: string;
  order: number;
  level: number;
  description: string | null;
  thumbnail: string | null;
  isActive: boolean;
  courseId: number | null;
  course?: { id: number; title: string };
  lessons?: Array<{
    id: number;
    title: string;
    order: number;
    type: string;
    isActive: boolean;
  }>;
};

export type UnitLessonSummary = NonNullable<UnitDetail["lessons"]>[number];
