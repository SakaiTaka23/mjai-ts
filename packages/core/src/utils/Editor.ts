import { Tile } from '@mjai/types';

import { sortHand } from './SortHand';

export const addTehai = (newTile: Tile, tehai: Tile[]): Tile[] => {
  tehai.push(newTile);
  return sortHand(tehai);
};

export const removeTehai = (tile: Tile, tehai: Tile[]): Tile[] => {
  const index = tehai.findIndex((t) => t === tile);
  if (index !== -1) {
    tehai.splice(index, 1);
  }
  return tehai;
};
