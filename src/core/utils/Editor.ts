import { Tile } from '@types';

import { sortHand } from './SortHand';

export const addTehai = (newTile: Tile, tehai: Tile[]): Tile[] => {
  return sortHand([...tehai, newTile]);
};

export const removeTehai = (tile: Tile, tehai: Tile[]): Tile[] => {
  const index = tehai.findIndex((t) => t === tile);
  if (index === -1) return tehai;
  return [...tehai.slice(0, index), ...tehai.slice(index + 1)];
};
