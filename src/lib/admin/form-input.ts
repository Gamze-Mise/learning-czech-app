export function adminFormInputClass(hasError: boolean): string {
  return [
    "w-full rounded-xl border px-3 py-2 text-slate-900",
    hasError
      ? "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-200"
      : "border-slate-300 focus:border-indigo-400 focus:ring-indigo-100",
  ].join(" ");
}
