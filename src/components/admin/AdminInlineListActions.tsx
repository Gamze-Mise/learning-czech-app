type Props = {
  busy: boolean;
  onEdit: () => void;
  onDeactivate: () => void;
};

export default function AdminInlineListActions({ busy, onEdit, onDeactivate }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={busy}
        onClick={onEdit}
        className="text-xs font-semibold text-indigo-700 hover:underline"
      >
        Edit
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={onDeactivate}
        className="text-xs font-semibold text-rose-700 hover:underline"
      >
        Deactivate
      </button>
    </div>
  );
}
