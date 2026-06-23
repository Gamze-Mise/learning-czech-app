"use client";

import { useEffect, useState } from "react";

export function useAdminListFetch<T>(
  endpoint: string,
  listKey: string,
  errorMessage: string
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(endpoint)
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((d) => setItems((d[listKey] as T[]) ?? []))
      .catch(() => setError(errorMessage))
      .finally(() => setLoading(false));
  }, [endpoint, listKey, errorMessage]);

  return { items, loading, error };
}
