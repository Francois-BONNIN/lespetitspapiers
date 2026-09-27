import { useEffect, useState } from "react";

export function useRecentlyAdded(ids: string[], duration = 900): Set<string> {
  const key = ids.join("|");
  const [seen, setSeen] = useState(() => ({ key, ids: new Set(ids) }));
  const [recent, setRecent] = useState<Set<string>>(() => new Set());

  if (seen.key !== key) {
    const added = ids.filter((id) => !seen.ids.has(id));
    setSeen({ key, ids: new Set(ids) });
    if (added.length > 0) {
      setRecent((current) => new Set([...current, ...added]));
    }
  }

  useEffect(() => {
    if (recent.size === 0) return;
    const timer = window.setTimeout(() => setRecent(new Set()), duration);
    return () => window.clearTimeout(timer);
  }, [recent, duration]);

  return recent;
}
