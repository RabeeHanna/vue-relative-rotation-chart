/** Domain/bounds helpers — implemented in C8. */
export function padExtent(min: number, max: number, padding: number): [number, number] {
  return [min - padding, max + padding]
}
