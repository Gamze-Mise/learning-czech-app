type Props = {
  options: Array<{ text?: string } | string>;
  selectedAnswer: string;
  onSelect: (answer: string) => void;
};

export default function ExerciseMcqChoices({ options, selectedAnswer, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((option, i) => {
        const optionText = typeof option === "string" ? option : (option.text ?? "");
        const active = selectedAnswer === optionText;
        return (
          <button
            type="button"
            key={i}
            onClick={() => onSelect(optionText)}
            className={`p-4 rounded-xl border-2 text-left transition-colors ${
              active
                ? "border-indigo-500 bg-indigo-50 text-indigo-900 font-semibold"
                : "border-slate-300 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-900 bg-white font-medium"
            }`}
          >
            <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
            {optionText}
          </button>
        );
      })}
    </div>
  );
}
