type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function ExerciseFillInput({ value, onChange, onSubmit }: Props) {
  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 border-2 border-slate-300 rounded-xl focus:border-indigo-500 focus:outline-none text-lg text-slate-900 bg-white"
        placeholder="Type your answer…"
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
        }}
      />
    </div>
  );
}
