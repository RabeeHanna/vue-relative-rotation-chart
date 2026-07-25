import type { RrgRenderSeries } from '../types/rrg'
import { trail } from './trail'

/** One ticker parked in each quadrant — longer trails for playback. */
export const quadrantTour: RrgRenderSeries[] = [
  trail(
    'LEAD',
    'LEAD',
    { x: 106, y: 108 },
    [
      { dx: 0.4, dy: -0.3 },
      { dx: 0.5, dy: -0.2 },
      { dx: 0.3, dy: 0.1 },
      { dx: 0.4, dy: -0.2 },
      { dx: 0.2, dy: 0.2 },
      { dx: 0.3, dy: -0.1 },
      { dx: 0.2, dy: 0.1 },
    ],
    'Leading',
  ),
  trail(
    'WEAK',
    'WEAK',
    { x: 108, y: 96 },
    [
      { dx: 0.3, dy: -0.4 },
      { dx: 0.2, dy: -0.5 },
      { dx: -0.1, dy: -0.3 },
      { dx: 0.2, dy: -0.4 },
      { dx: -0.2, dy: -0.2 },
      { dx: 0.1, dy: -0.3 },
      { dx: -0.1, dy: -0.2 },
    ],
    'Weakening',
  ),
  trail(
    'LAGG',
    'LAGG',
    { x: 94, y: 94 },
    [
      { dx: -0.4, dy: -0.2 },
      { dx: -0.3, dy: 0.1 },
      { dx: -0.4, dy: -0.2 },
      { dx: -0.2, dy: 0.3 },
      { dx: -0.3, dy: -0.1 },
      { dx: -0.2, dy: 0.2 },
      { dx: -0.1, dy: 0.1 },
    ],
    'Lagging',
  ),
  trail(
    'IMPR',
    'IMPR',
    { x: 94, y: 106 },
    [
      { dx: -0.3, dy: 0.4 },
      { dx: 0.2, dy: 0.3 },
      { dx: -0.2, dy: 0.4 },
      { dx: 0.3, dy: 0.2 },
      { dx: -0.1, dy: 0.3 },
      { dx: 0.2, dy: 0.2 },
      { dx: 0.1, dy: 0.1 },
    ],
    'Improving',
  ),
]

/** Classic clockwise rotation through all four quadrants. */
export const rotationCycle: RrgRenderSeries[] = [
  trail(
    'CYCLE',
    'CYCLE',
    { x: 105, y: 105 },
    [
      { dx: 1.5, dy: -2 },
      { dx: 1.2, dy: -3 },
      { dx: 0.5, dy: -3 },
      { dx: -2, dy: -2 },
      { dx: -3, dy: -1 },
      { dx: -3, dy: 1.5 },
      { dx: -2, dy: 3 },
      { dx: -0.5, dy: 3 },
      { dx: 2, dy: 2 },
      { dx: 3, dy: 1 },
      { dx: 2.5, dy: -1 },
      { dx: 1.5, dy: -2 },
      { dx: 0.8, dy: -1.5 },
    ],
    'Rotation cycle',
  ),
]
