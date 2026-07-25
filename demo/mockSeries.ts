/** Basic mock series for the demo playground — expanded in later units. */
export const mockSeries = [
  {
    ticker: 'XLK',
    label: 'XLK',
    name: 'Technology',
    points: [
      { date: '2024-01-05', x: 104.2, y: 102.1, quadrant: 'leading' as const },
      { date: '2024-01-12', x: 105.1, y: 101.8, quadrant: 'leading' as const },
      { date: '2024-01-19', x: 103.8, y: 103.2, quadrant: 'leading' as const },
    ],
  },
  {
    ticker: 'XLF',
    label: 'XLF',
    name: 'Financials',
    points: [
      { date: '2024-01-05', x: 97.2, y: 96.8, quadrant: 'lagging' as const },
      { date: '2024-01-12', x: 96.5, y: 97.4, quadrant: 'lagging' as const },
      { date: '2024-01-19', x: 97.8, y: 98.1, quadrant: 'lagging' as const },
    ],
  },
  {
    ticker: 'XLE',
    label: 'XLE',
    name: 'Energy',
    points: [
      { date: '2024-01-05', x: 101.5, y: 97.2, quadrant: 'weakening' as const },
      { date: '2024-01-12', x: 102.0, y: 96.5, quadrant: 'weakening' as const },
      { date: '2024-01-19', x: 101.2, y: 95.8, quadrant: 'weakening' as const },
    ],
  },
  {
    ticker: 'XLU',
    label: 'XLU',
    name: 'Utilities',
    points: [
      { date: '2024-01-05', x: 96.0, y: 102.5, quadrant: 'improving' as const },
      { date: '2024-01-12', x: 96.8, y: 103.1, quadrant: 'improving' as const },
      { date: '2024-01-19', x: 97.5, y: 102.2, quadrant: 'improving' as const },
    ],
  },
  {
    ticker: 'XLI',
    label: 'XLI',
    name: 'Industrials',
    points: [
      { date: '2024-01-05', x: 100.4, y: 100.2, quadrant: 'leading' as const },
      { date: '2024-01-12', x: 100.8, y: 99.6, quadrant: 'weakening' as const },
      { date: '2024-01-19', x: 99.5, y: 99.1, quadrant: 'lagging' as const },
    ],
  },
]

export const mockSelectedDate = '2024-01-19'
