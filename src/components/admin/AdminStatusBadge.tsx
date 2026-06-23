type Props = {
  isActive: boolean;
};

export default function AdminStatusBadge({ isActive }: Props) {
  if (isActive) {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-emerald-600/15">
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
      Inactive
    </span>
  );
}
