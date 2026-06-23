type Props = {
  pct: number;
  current: number;
  total: number;
  cycle: 1 | 2;
};

export default function ExerciseProgressBar({ pct, current, total, cycle }: Props) {
  return (
    <>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>
          {current} / {total}
        </span>
        <span>{cycle === 2 ? "Review" : "Session"}</span>
      </div>
    </>
  );
}
