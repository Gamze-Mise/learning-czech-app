import Button from "@/components/Button";

type Props = {
  firstUnit?: { title: string } | null;
  firstLesson?: { title: string } | null;
  startLearningLink: string;
};

export default function QuickStartSection({
  firstUnit,
  firstLesson,
  startLearningLink,
}: Props) {
  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white text-center">
      <h2 className="text-2xl font-bold mb-2">Ready to Start Learning?</h2>
      <p className="text-green-100 mb-4">
        {firstUnit
          ? `${firstUnit.title} is ready for you!`
          : "Start your Czech learning journey!"}
      </p>
      <Button
        href={startLearningLink}
        variant="outline"
        size="lg"
        className="!bg-white !text-green-800 hover:!bg-green-50 !font-bold !border-2 !border-white shadow-lg !text-lg"
      >
        {firstLesson ? `Start ${firstLesson.title}` : "Start Learning"}
      </Button>
    </div>
  );
}
