type Props = {
  activeRole: "user" | "admin";
  onUserClick?: () => void;
  onAdminClick?: () => void;
};

export default function AuthRoleToggle({
  activeRole,
  onUserClick,
  onAdminClick,
}: Props) {
  const activeClass =
    "rounded-lg px-3 py-2 text-sm font-semibold transition-colors bg-white text-slate-900 shadow-sm";
  const inactiveClass =
    "rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-slate-600 hover:text-slate-900";

  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={onUserClick}
          className={activeRole === "user" ? activeClass : inactiveClass}
        >
          User
        </button>
        <button
          type="button"
          onClick={onAdminClick}
          className={activeRole === "admin" ? activeClass : inactiveClass}
        >
          Admin
        </button>
      </div>
    </div>
  );
}
