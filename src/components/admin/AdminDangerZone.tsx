type Props = {
  actionLabel: string;
  onAction: () => void;
};

export default function AdminDangerZone({ actionLabel, onAction }: Props) {
  return (
    <div className="border border-red-200 bg-red-50 rounded-xl p-4">
      <p className="text-sm text-red-800 font-medium">Danger zone</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-2 text-sm text-red-700 underline"
      >
        {actionLabel}
      </button>
    </div>
  );
}
