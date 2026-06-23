type MatchingOption = { left?: string; right?: string };

type Props = {
  options: MatchingOption[];
  matchingPairs: Record<string, string>;
  selectedLeft: string | null;
  shuffledRightItems: string[];
  lastMatchFeedback: "correct" | "incorrect" | null;
  onLeftClick: (leftItem: string) => void;
  onRightClick: (rightItem: string) => void;
  onRemovePair: (leftItem: string) => void;
};

export default function ExerciseMatchingBoard({
  options,
  matchingPairs,
  selectedLeft,
  shuffledRightItems,
  lastMatchFeedback,
  onLeftClick,
  onRightClick,
  onRemovePair,
}: Props) {
  const rightItems = shuffledRightItems.length
    ? shuffledRightItems
    : options.map((o) => o.right ?? "");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h5 className="text-sm font-semibold text-slate-600">🇨🇿 Czech</h5>
          {options.map((opt, i) => {
            const leftItem = opt.left ?? "";
            const isSelected = selectedLeft === leftItem;
            const matchedRight = matchingPairs[leftItem];
            const isMatched = Boolean(matchedRight);
            const isCorrectMatch =
              isMatched &&
              options.some((o) => o.left === leftItem && o.right === matchedRight);
            return (
              <button
                key={i}
                type="button"
                onClick={() => onLeftClick(leftItem)}
                disabled={isCorrectMatch}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  isCorrectMatch
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900 cursor-not-allowed font-semibold"
                    : isMatched
                      ? "bg-rose-50 border-rose-300 text-rose-900 font-semibold"
                      : isSelected
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 font-semibold"
                        : "bg-white border-slate-300 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-900 font-medium"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{leftItem}</span>
                  {isMatched ? (
                    <span className="text-xs text-slate-600 font-semibold">
                      → {matchedRight}{" "}
                      <span
                        className="ml-2 text-rose-600 hover:text-rose-800 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemovePair(leftItem);
                        }}
                      >
                        ✕
                      </span>
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <h5 className="text-sm font-semibold text-slate-600">🇺🇸 English</h5>
          {rightItems.map((rightItem, i) => {
            const matchedEntry = Object.entries(matchingPairs).find(
              ([, value]) => value === rightItem
            );
            const isUsed = Boolean(matchedEntry);
            return (
              <button
                key={i}
                type="button"
                onClick={() => onRightClick(rightItem)}
                disabled={!selectedLeft || isUsed}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  isUsed
                    ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed font-semibold"
                    : selectedLeft
                      ? "bg-emerald-50 border-emerald-300 hover:bg-emerald-100 text-slate-900 font-medium"
                      : "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                <span>{rightItem}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-xs text-slate-600">
        {Object.keys(matchingPairs).length} / {options.length} pairs
        {lastMatchFeedback === "correct" ? " • ✓" : ""}
        {lastMatchFeedback === "incorrect" ? " • ✗" : ""}
      </div>
    </div>
  );
}
