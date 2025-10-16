import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default async function UnitsPage() {
  // Fetch courses and units from database
  const courses = await prisma.courses.findMany({
    include: {
      units: {
        include: {
          lessons: {
            include: {
              flashcards: true,
              exercises: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  const firstCourse = courses[0];
  const units = firstCourse?.units || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="📚 Czech Learning Units"
        subtitle="Choose a unit to start your Czech language journey"
        className="py-8"
      />

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit, index) => {
          const isFirstUnit = index === 0;
          const totalLessons = unit.lessons.length;
          const totalFlashcards = unit.lessons.reduce(
            (sum: number, lesson: any) => sum + lesson.flashcards.length,
            0
          );
          const totalExercises = unit.lessons.reduce(
            (sum: number, lesson: any) => sum + lesson.exercises.length,
            0
          );

          return (
            <Card key={unit.id}>
              <div className="text-center">
                <div className="mb-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      isFirstUnit ? "bg-green-100" : "bg-blue-100"
                    }`}
                  >
                    <span
                      className={`text-2xl font-bold ${
                        isFirstUnit ? "text-green-600" : "text-blue-600"
                      }`}
                    >
                      {unit.order}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {unit.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {unit.description}
                  </p>
                </div>

                {/* Unit Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-gray-700">
                      {totalLessons}
                    </div>
                    <div className="text-xs text-gray-500">Lessons</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-gray-700">
                      {totalFlashcards}
                    </div>
                    <div className="text-xs text-gray-500">Cards</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-gray-700">
                      {totalExercises}
                    </div>
                    <div className="text-xs text-gray-500">Exercises</div>
                  </div>
                </div>

                {/* Status Badge */}
                {isFirstUnit && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      ✓ Ready to Start
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  {isFirstUnit ? (
                    <>
                      <Button
                        href={`/units/${unit.id}/lessons/${unit.lessons[0]?.id}/practice`}
                        variant="primary"
                        className="w-full"
                      >
                        Start Learning
                      </Button>
                      <Button
                        href={`/units/${unit.id}`}
                        variant="outline"
                        className="w-full"
                      >
                        View Unit
                      </Button>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-2">
                        Coming Soon
                      </div>
                      <Button
                        href={`/units/${unit.id}`}
                        variant="outline"
                        className="w-full opacity-50 cursor-not-allowed"
                        disabled
                      >
                        View Unit
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Start Section */}
      {units.length > 0 && (
        <Card>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Ready to Start Your Czech Journey?
            </h3>
            <p className="text-gray-600 mb-4">
              Begin with Unit 1 "Basic Greetings" - it's complete and ready for
              you!
            </p>
            <Button
              href={`/units/${units[0].id}/lessons/${units[0].lessons[0]?.id}/practice`}
              variant="primary"
              size="lg"
            >
              Start Unit 1 - Basic Greetings
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
