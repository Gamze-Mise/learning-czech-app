import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import Button from "@/components/Button";
import { prisma } from "@/lib/prisma";

export default async function Home() {
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

  // Calculate progress statistics
  const totalUnits = courses.reduce(
    (sum: number, course: any) => sum + course.units.length,
    0
  );
  const totalLessons = courses.reduce(
    (sum: number, course: any) =>
      sum +
      course.units.reduce(
        (unitSum: number, unit: any) => unitSum + unit.lessons.length,
        0
      ),
    0
  );
  const totalFlashcards = courses.reduce(
    (sum: number, course: any) =>
      sum +
      course.units.reduce(
        (unitSum: number, unit: any) =>
          unitSum +
          unit.lessons.reduce(
            (lessonSum: number, lesson: any) =>
              lessonSum + lesson.flashcards.length,
            0
          ),
        0
      ),
    0
  );

  // Get first course and its first unit for recommendations
  const firstCourse = courses[0];
  const firstUnit = firstCourse?.units[0];
  const firstLesson = firstUnit?.lessons[0];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <PageHeader
        title="🇨🇿 Welcome to Czech Learning"
        subtitle="Start your journey to master the Czech language"
        className="py-8"
      />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dashboard - Progress Panel */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Dashboard</h2>

          {/* Progress Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Progress Overview
            </h3>
            <div className="space-y-3">
              <ProgressBar
                label="Courses"
                percentage={courses.length > 0 ? 100 : 0}
                color="blue"
              />
              <ProgressBar
                label="Units"
                percentage={totalUnits > 0 ? 100 : 0}
                color="green"
              />
              <ProgressBar
                label="Lessons"
                percentage={totalLessons > 0 ? 100 : 0}
                color="purple"
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">
                  {totalFlashcards}
                </div>
                <div className="text-xs text-blue-500">Flashcards</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">
                  {totalLessons}
                </div>
                <div className="text-xs text-green-500">Lessons</div>
              </div>
            </div>
          </div>

          {/* Units Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Available Units
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {firstCourse?.units.slice(0, 4).map((unit: any) => (
                <a
                  key={unit.id}
                  href={`/units/${unit.id}`}
                  className="p-3 rounded-lg text-center text-sm font-medium transition-colors bg-blue-100 text-blue-700 border-2 border-blue-300 hover:bg-blue-200"
                >
                  {unit.title}
                </a>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full">
            Review Flashcards
          </Button>
        </Card>

        {/* Dashboard - Recommended Panel */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended</h2>

          {/* Course Information */}
          {firstCourse && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Current Course
              </h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800">
                  {firstCourse.title}
                </h4>
                <p className="text-sm text-blue-600 mt-1">
                  {firstCourse.description}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded">
                    Level {firstCourse.level}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Recommended Lessons */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Start Learning
            </h3>
            <div className="space-y-3">
              {firstUnit && firstLesson && (
                <a
                  href={`/units/${firstUnit.id}/lessons/${firstLesson.id}`}
                  className="block bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors"
                >
                  <p className="text-sm text-green-800 font-medium">
                    {firstLesson.title}
                  </p>
                  <p className="text-xs text-green-600">
                    {firstLesson.description}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">
                      {firstLesson.type}
                    </span>
                    <span className="text-xs text-green-500">
                      {firstLesson.estimatedTime} min
                    </span>
                  </div>
                </a>
              )}

              {firstUnit?.lessons[1] && (
                <a
                  href={`/units/${firstUnit.id}/lessons/${firstUnit.lessons[1].id}`}
                  className="block bg-purple-50 rounded-lg p-3 hover:bg-purple-100 transition-colors"
                >
                  <p className="text-sm text-purple-800 font-medium">
                    {firstUnit.lessons[1].title}
                  </p>
                  <p className="text-xs text-purple-600">
                    {firstUnit.lessons[1].description}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded">
                      {firstUnit.lessons[1].type}
                    </span>
                    <span className="text-xs text-purple-500">
                      {firstUnit.lessons[1].estimatedTime} min
                    </span>
                  </div>
                </a>
              )}
            </div>
          </div>

          {firstUnit && firstLesson && (
            <Button
              href={`/units/${firstUnit.id}/lessons/${firstLesson.id}`}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Start Learning
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
