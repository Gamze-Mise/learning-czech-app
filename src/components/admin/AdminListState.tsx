type LoadingProps = {
  titleWidth?: string;
};

export function AdminListLoadingSkeleton({ titleWidth = "w-44" }: LoadingProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
      <div className={`h-4 ${titleWidth} animate-pulse rounded bg-slate-200`} />
      <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}

type ErrorProps = {
  message: string;
};

export function AdminListError({ message }: ErrorProps) {
  return (
    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {message}
    </p>
  );
}

type TableShellProps = {
  isEmpty: boolean;
  emptyMessage: string;
  children: React.ReactNode;
};

export function AdminTableShell({ isEmpty, emptyMessage, children }: TableShellProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      <div className="overflow-x-auto">{children}</div>
      {isEmpty ? (
        <p className="px-6 py-12 text-center text-sm text-slate-500">{emptyMessage}</p>
      ) : null}
    </div>
  );
}
