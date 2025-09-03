// src/hooks/useCountryOptions.ts
import { useEffect, useMemo, useState } from "react";
import {
  getCountryList,
} from "../modules/country/api/api";

export type Option = { label: string; value: string };

export function useCountryOptions() {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        // const opts = await getCountryMapViaList({ signal: ac.signal });
        const list = await getCountryList({ signal: ac.signal });
        const opts = list
          .map((c) => ({
            label: c.en_name ?? c.name,
            value: c.id,
          }))
          .filter((o) => !!o.label && !!o.value)
          .sort((a, b) => a.label.localeCompare(b.label));
        setOptions(opts);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(e);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // กัน null/dup แถมเรียงชื่อไว้แล้วจาก API layer
  const safeOptions = useMemo(
    () => options.filter((o) => o.label && o.value),
    [options]
  );

  return {
    countryOptions: safeOptions,
    countryLoading: loading,
    countryError: error,
  };
}
