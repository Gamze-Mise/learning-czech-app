"use client";

import { useParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/Button";
import UnitOverviewCard from "@/components/learner/UnitOverviewCard";
import UnitLessonGrid from "@/components/learner/UnitLessonGrid";
import { useUnitProgress } from "@/hooks/learner/useUnitProgress";

export default function UnitPage() {
  const params = useParams();
  const unitId = params.id as string;
  const { unit, loading } = useUnitProgress(unitId);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading Unit..."
          subtitle="Please wait while we load your progress"
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="ml-4 text-gray-600">Loading unit data...</p>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Unit Not Found"
          subtitle="The unit you're looking for doesn't exist"
        />
        <div className="text-center py-8">
          <Button href="/" variant="primary">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UnitOverviewCard unit={unit} />

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Lessons</h2>
        <UnitLessonGrid lessons={unit.lessons} unitId={unitId} />
      </div>

      <div className="text-center">
        <Button href="/" variant="outline" className="inline-flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
