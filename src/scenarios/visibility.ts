import type { RrgRenderSeries } from '../types/rrg'
import { trail } from './trail'

/** Single date — sparse frame; paste `[]` in BYO for fully empty. */
export const emptyOrSparse: RrgRenderSeries[] = [
  {
    ticker: 'SPARSE',
    label: 'SPARSE',
    name: 'Single date',
    points: [{ date: '2024-06-15', x: 100, y: 100, quadrant: 'leading' }],
  },
]

/** Two visible, two hidden via `visible: false`. */
export const mixedVisibility: RrgRenderSeries[] = [
  trail(
    'SHOW',
    'SHOW',
    { x: 103, y: 104 },
    [
      { dx: 0.3, dy: 0.2 },
      { dx: 0.4, dy: -0.1 },
      { dx: 0.3, dy: 0.2 },
      { dx: 0.2, dy: -0.2 },
      { dx: 0.3, dy: 0.1 },
      { dx: 0.2, dy: -0.1 },
    ],
    'Visible A',
  ),
  trail(
    'HIDE',
    'HIDE',
    { x: 97, y: 97 },
    [
      { dx: -0.3, dy: -0.2 },
      { dx: -0.2, dy: 0.1 },
      { dx: -0.3, dy: -0.1 },
      { dx: -0.2, dy: 0.2 },
      { dx: -0.1, dy: -0.1 },
      { dx: -0.2, dy: 0.1 },
    ],
    'Hidden',
    false,
  ),
  trail(
    'SHOW2',
    'SHOW2',
    { x: 103, y: 97 },
    [
      { dx: 0.2, dy: -0.3 },
      { dx: 0.1, dy: -0.2 },
      { dx: 0.3, dy: -0.2 },
      { dx: 0.2, dy: -0.1 },
      { dx: 0.1, dy: -0.2 },
      { dx: 0.2, dy: -0.1 },
    ],
    'Visible B',
  ),
  trail(
    'HIDE2',
    'HIDE2',
    { x: 97, y: 103 },
    [
      { dx: -0.2, dy: 0.3 },
      { dx: 0.1, dy: 0.2 },
      { dx: -0.2, dy: 0.2 },
      { dx: -0.1, dy: 0.3 },
      { dx: 0.1, dy: 0.2 },
      { dx: -0.1, dy: 0.1 },
    ],
    'Hidden B',
    false,
  ),
]
