/** Label geometry helpers — implemented in C6. */
export function estimateLabelWidth(label: string, charWidth = 7): number {
  return Math.max(charWidth * 2, label.length * charWidth)
}
