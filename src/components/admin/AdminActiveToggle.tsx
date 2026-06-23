type Props = {
  isActive: boolean;
  onChange: (next: boolean) => void;
  inactiveDescription?: string;
};

export default function AdminActiveToggle({
  isActive,
  onChange,
  inactiveDescription = "Passive (hidden in app)",
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-900">Status</p>
        <p className="text-xs text-slate-600 mt-0.5">
          {isActive ? "Active (visible in app)" : inactiveDescription}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isActive}
        onClick={() => onChange(!isActive)}
        className={[
          "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
          isActive ? "bg-indigo-600" : "bg-slate-300",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
            isActive ? "translate-x-6" : "translate-x-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
