export function parseRouteId(
  value: string,
  label = "id"
): { id: number } | { error: string } {
  const id = Number(value);
  if (!Number.isFinite(id) || !Number.isInteger(id) || id < 1) {
    return { error: `Invalid ${label}` };
  }
  return { id };
}
