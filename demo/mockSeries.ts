/** Basic mock series for the demo playground — expanded in later units. */
export const mockSeries = [
  {
    ticker: 'XLK',
    label: 'XLK',
    name: 'Technology',
    color: '#3b82f6',
    points: [
      { date: '2024-01-01', x: 102, y: 101, quadrant: 'leading' as const },
      { date: '2024-02-01', x: 103, y: 100.5, quadrant: 'leading' as const },
      { date: '2024-03-01', x: 104, y: 101.2, quadrant: 'leading' as const },
    ],
  },
  {
    ticker: 'XLF',
    label: 'XLF',
    name: 'Financials',
    color: '#22c55e',
    points: [
      { date: '2024-01-01', x: 98, y: 99, quadrant: 'lagging' as const },
      { date: '2024-02-01', x: 97.5, y: 98.5, quadrant: 'lagging' as const },
      { date: '2024-03-01', x: 97, y: 99.2, quadrant: 'lagging' as const },
    ],
  },
]

export const mockSelectedDate = '2024-03-01'
