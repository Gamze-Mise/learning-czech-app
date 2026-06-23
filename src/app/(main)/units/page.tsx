import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import UnitCatalogCard from "@/components/units/UnitCatalogCard";

export const dynamic = "force-dynamic";

export default async function UnitsPage() {
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
    <div className="space-y-8">
      <PageHeader
        title="📚 Czech Learning Units"
        subtitle="Choose a unit to start your Czech language journey"
        className="py-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {units.map((unit) => (
          <UnitCatalogCard key={unit.id} unit={unit} />
        ))}
      </div>

      {units.length > 0 && (
        <Card className="border border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
          <div className="text-center py-2">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Ready to Start Your Czech Journey?
            </h3>
            <p className="text-slate-700 mb-5">
              {`Begin with Unit 1 (“Basic Greetings”) — it is complete and ready for you!`}
            </p>
            <Button
              href={`/units/${units[0].id}/lessons/${units[0].lessons[0]?.id}/practice`}
              variant="primary"
              size="lg"
              className="shadow-sm !bg-indigo-600 hover:!bg-indigo-700 !rounded-xl !font-semibold"
            >
              Start Unit 1 - Basic Greetings
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
