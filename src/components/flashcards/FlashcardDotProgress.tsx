import Button from "@/components/Button";

type Rating = { index: number; result: "known" | "unknown" };

type Props = {
  total: number;
  currentIndex: number;
  sessionRatings: Rating[];
  onJump: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

export default function FlashcardDotProgress({
  total,
  currentIndex,
  sessionRatings,
  onJump,
  onPrevious,
  onNext,
}: Props) {
  return (
    <div className="flex justify-center items-center space-x-4">
      <Button onClick={onPrevious} variant="outline" disabled={currentIndex === 0}>
        ← Previous
      </Button>
      <div className="flex space-x-2">
        {Array.from({ length: total }).map((_, index) => {
          const rating = sessionRatings.find((r) => r.index === index);
          const dotClass = rating?.result === "known"
            ? "bg-green-500"
            : rating?.result === "unknown"
              ? "bg-red-400"
              : index === currentIndex
                ? "bg-blue-600"
                : "bg-gray-300";
          return (
            <button
              key={index}
              type="button"
              onClick={() => onJump(index)}
              className={`w-3 h-3 rounded-full transition-colors ${dotClass}`}
            />
          );
        })}
      </div>
      <Button onClick={onNext} variant="outline" disabled={currentIndex === total - 1}>
        Next →
      </Button>
    </div>
  );
}
