type Props = {
  open: boolean;
  titleId: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
};

export default function AdminSaveSuccessModal({
  open,
  titleId,
  title,
  subtitle,
  actionLabel,
  onAction,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl ring-1 ring-black/5 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-emerald-500/20 motion-safe:animate-ping" />
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow motion-safe:animate-bounce">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path
                  fillRule="evenodd"
                  d="M16.704 5.29a1 1 0 0 1 .006 1.415l-7.5 7.6a1 1 0 0 1-1.42.004L3.296 9.814a1 1 0 1 1 1.408-1.42l3.083 3.06 6.793-6.887a1 1 0 0 1 1.424.723Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
          <div>
            <h2 id={titleId} className="text-base font-semibold text-slate-900">
              {title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <button
          type="button"
          className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-800"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
