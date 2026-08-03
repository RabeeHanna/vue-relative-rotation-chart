/** Shared omit-empty helper for copy merge functions. */
export function omitEmpty(
  partial?: Record<string, string | undefined> | null,
): Record<string, string> {
  if (!partial) return {}
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(partial)) {
    if (typeof v === 'string' && v.trim() !== '') out[k] = v
  }
  return out
}
