import { Tile } from '@types';

const tileOrder: Record<Tile, number> = {
  // Manzu
  '1m': 0,
  '2m': 1,
  '3m': 2,
  '4m': 3,
  '5m': 4,
  '5mr': 5,
  '6m': 6,
  '7m': 7,
  '8m': 8,
  '9m': 9,

  // Pinzu
  '1p': 10,
  '2p': 11,
  '3p': 12,
  '4p': 13,
  '5p': 14,
  '5pr': 15,
  '6p': 16,
  '7p': 17,
  '8p': 18,
  '9p': 19,

  // Souzu
  '1s': 20,
  '2s': 21,
  '3s': 22,
  '4s': 23,
  '5s': 24,
  '5sr': 25,
  '6s': 26,
  '7s': 27,
  '8s': 28,
  '9s': 29,

  // Wind
  E: 30,
  S: 31,
  W: 32,
  N: 33,

  // Dragon
  P: 34,
  F: 35,
  C: 36,

  // Special
  '?': 37,
};

export const sortHand = (tiles: Tile[]): Tile[] => {
  return [...tiles].sort((a, b) => tileOrder[a] - tileOrder[b]);
};
