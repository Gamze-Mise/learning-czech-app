import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";
import CoverImage from "@/components/CoverImage";

type UnitLesson = {
  id: number;
  flashcards: unknown[];
  exercises: unknown[];
};

export type UnitCatalogItem = {
  id: number;
  order: number;
  title: string;
  description: string | null;
  thumbnail: string | null;
  isActive: boolean;
  lessons: UnitLesson[];
};

type UnitCatalogCardProps = {
  unit: UnitCatalogItem;
};

export default function UnitCatalogCard({ unit }: UnitCatalogCardProps) {
  const isActive = unit.isActive;
  const totalLessons = unit.lessons.length;
  const totalFlashcards = unit.lessons.reduce(
    (sum, lesson) => sum + lesson.flashcards.length,
    0,
  );
  const totalExercises = unit.lessons.reduce(
    (sum, lesson) => sum + lesson.exercises.length,
    0,
  );

  return (
    <Card
      className={`h-full border shadow-sm ${
        isActive
          ? "relative cursor-pointer border-slate-200 bg-white transition-all hover:shadow-md hover:-translate-y-0.5"
          : "border-slate-200 bg-slate-50/80"
      }`}
    >
      {isActive ? (
        <Link
          href={`/units/${unit.id}`}
          aria-label={`View ${unit.title}`}
          className="absolute inset-0 z-0 rounded-xl"
        />
      ) : null}
      <div className="relative z-10 flex h-full flex-col pointer-events-none">
        <div className="relative mb-5">
          <CoverImage
            src={unit.thumbnail}
            alt={`${unit.title} cover`}
            title={unit.title}
            aspectClassName="aspect-square"
            fit="contain"
          />
        </div>
        <div className="text-center pb-5 border-b border-slate-100">
          {!unit.thumbnail ? (
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner ${
                isActive
                  ? "bg-gradient-to-br from-blue-50 to-indigo-100"
                  : "bg-slate-100"
              }`}
            >
              <span
                className={`text-2xl font-bold ${
                  isActive ? "text-indigo-600" : "text-slate-400"
                }`}
              >
                {unit.order}
              </span>
            </div>
          ) : null}
          <h3
            className={`text-xl font-bold mb-2 ${
              isActive ? "text-slate-900" : "text-slate-500"
            }`}
          >
            {unit.title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed min-h-[40px]">
            {unit.description}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5 text-center">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div
              className={`text-lg font-bold ${
                isActive ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {isActive ? totalLessons : "?"}
            </div>
            <div className="text-xs text-slate-500">Lessons</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div
              className={`text-lg font-bold ${
                isActive ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {isActive ? totalFlashcards : "?"}
            </div>
            <div className="text-xs text-slate-500">Cards</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div
              className={`text-lg font-bold ${
                isActive ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {isActive ? totalExercises : "?"}
            </div>
            <div className="text-xs text-slate-500">Exercises</div>
          </div>
        </div>

        <div className="mt-5">
          {!isActive ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
              🚧 Coming Soon
            </span>
          ) : null}
        </div>
        <div className="mt-auto pt-6 pointer-events-auto">
          {isActive ? (
            <div className="grid grid-cols-2 gap-3">
              <Button
                href={`/units/${unit.id}/lessons/${unit.lessons[0]?.id}/practice`}
                variant="primary"
                className="w-full !rounded-xl !py-2.5 !font-semibold !text-sm shadow-sm !bg-indigo-600 hover:!bg-indigo-700"
              >
                Start
              </Button>
              <Button
                href={`/units/${unit.id}`}
                variant="outline"
                className="w-full !rounded-xl !py-2.5 !font-semibold !text-sm !border !border-slate-300 !text-slate-700 hover:!bg-slate-100"
              >
                View Unit
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full !py-2.5 opacity-60 cursor-not-allowed !rounded-xl !border !border-slate-200 !text-slate-500 !bg-slate-100"
              disabled
            >
              Coming Soon
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
