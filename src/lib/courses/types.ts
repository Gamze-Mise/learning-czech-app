export type CourseDetail = {
  id: number;
  title: string;
  order: number;
  level: number;
  description: string | null;
  thumbnail: string | null;
  isActive: boolean;
  units?: Array<{
    id: number;
    title: string;
    order: number;
    level: number;
    isActive: boolean;
  }>;
};

export type CourseUnitSummary = NonNullable<CourseDetail["units"]>[number];
