import { Tile } from '@types';

import { hairi } from './Shanten';
import { HaiArr } from './YakuTypes';
import { Fuuro } from '../types/Tehai';

/**
 * Result of ukeire calculation
 */
export interface UkeireResult {
  /** Shanten (向聴数) - number of tiles away from winning (0 = tenpai, -1 = winning) */
  shanten: number;
  /** Total number of tiles that improve the hand */
  ukeire: number;
  /** Map of waiting tiles to their counts */
  tiles: Map<Tile, number>;
  /** Optional: discard options for 14-tile hands */
  discardOptions?: Map<Tile, DiscardOption>;
}

/**
 * Information about a discard option for 14-tile hands
 */
export interface DiscardOption {
  /** Tile to discard */
  discard: Tile;
  /** Resulting shanten after discard */
  shanten: number;
  /** Resulting ukeire count after discard */
  ukeire: number;
  /** Waiting tiles after discard */
  tiles: Map<Tile, number>;
}

const internalToTile = (internal: string): Tile => {
  const honorMap: Record<string, Tile> = {
    '1z': 'E',
    '2z': 'S',
    '3z': 'W',
    '4z': 'N',
    '5z': 'P',
    '6z': 'F',
    '7z': 'C',
  };

  return honorMap[internal] || internal;
};

const tileToExternalFormat = (map: Map<string, number>): Map<Tile, number> => {
  const result = new Map<Tile, number>();
  for (const [key, value] of map.entries()) {
    result.set(internalToTile(key), value);
  }
  return result;
};

const tileToInternalFormat = (tile: Tile): string => {
  if (tile === '5mr') return '5m';
  if (tile === '5pr') return '5p';
  if (tile === '5sr') return '5s';

  const honorMap: Record<string, string> = {
    E: '1z',
    S: '2z',
    W: '3z',
    N: '4z',
    P: '5z',
    F: '6z',
    C: '7z',
  };

  return honorMap[tile] || tile;
};

/**
 * Convert internal tile string to HaiArr indices
 */
const stringToHaiArrIndex = (tileStr: string): [number, number] => {
  const suit = tileStr[tileStr.length - 1];
  const number = parseInt(tileStr[0]);

  const suitIndex = ['m', 'p', 's', 'z'].indexOf(suit);
  const numberIndex = number - 1;

  return [suitIndex, numberIndex];
};

/**
 * Extract all tiles from a fuuro (chi, pon, kan, etc.)
 */
const extractTilesFromFuuro = (fuuro: Fuuro): Tile[] => {
  switch (fuuro.type) {
    case 'chi':
    case 'pon':
      return [fuuro.pai, ...fuuro.consumed];

    case 'ankan':
      return [...fuuro.consumed];

    case 'daiminkan':
      return [fuuro.pai, ...fuuro.consumed];

    case 'kakan':
      return [fuuro.pai, ...fuuro.consumed];
  }
};

const convertToHaiArray = (tehai: Tile[], fuuros: Fuuro[] = []): HaiArr => {
  const haiArr: HaiArr = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];

  for (const tile of tehai) {
    const internalTile = tileToInternalFormat(tile);
    const [suit, number] = stringToHaiArrIndex(internalTile);
    if (suit >= 0 && number >= 0 && suit < haiArr.length) {
      haiArr[suit][number]++;
    }
  }

  for (const fuuro of fuuros) {
    const tiles = extractTilesFromFuuro(fuuro);
    for (const tile of tiles) {
      const internalTile = tileToInternalFormat(tile);
      const [suit, number] = stringToHaiArrIndex(internalTile);
      if (suit >= 0 && number >= 0 && suit < haiArr.length) {
        haiArr[suit][number]++;
      }
    }
  }

  return haiArr;
};

/**
 * Calculate ukeire (受け入れ) for a given hand
 *
 * @param tehai - Array of tiles in hand (external format: '1m', 'E', '5mr', etc.)
 * @param fuuros - Optional array of fuuro (chi, pon, kan)
 * @returns UkeireResult with shanten, ukeire count, and waiting tiles
 */
export const calculateUkeire = (
  tehai: Tile[],
  fuuros: Fuuro[] = [],
): UkeireResult => {
  const kanCount = fuuros.filter(
    (fuuro) =>
      fuuro.type === 'ankan' ||
      fuuro.type === 'daiminkan' ||
      fuuro.type === 'kakan',
  ).length;
  const totalTiles =
    tehai.length +
    fuuros.reduce((sum, fuuro) => {
      return sum + extractTilesFromFuuro(fuuro).length;
    }, 0);
  const expectedMin = 13 + kanCount;
  const expectedMax = 14 + kanCount;

  if (totalTiles < expectedMin || totalTiles > expectedMax) {
    throw new Error(
      `Invalid tile count: ${totalTiles}. Expected ${expectedMin} or ${expectedMax} tiles.`,
    );
  }

  const haiArr = convertToHaiArray(tehai, fuuros);
  const result = hairi(haiArr);

  if (
    totalTiles === expectedMin ||
    (totalTiles === expectedMax && result.wait)
  ) {
    const tiles = result.wait ?? new Map<string, number>();
    const ukeire = Array.from(tiles.values()).reduce(
      (sum, count) => sum + count,
      0,
    );

    return {
      shanten: result.now,
      ukeire,
      tiles: tileToExternalFormat(tiles),
    };
  }

  const discardOptions = new Map<Tile, DiscardOption>();
  let bestUkeire = 0;
  const bestShanten = result.now;
  let bestTiles = new Map<string, number>();

  for (const [discard, waitMap] of Object.entries(result)) {
    if (discard === 'now' || discard === 'wait') continue;
    if (!(waitMap instanceof Map)) continue;

    const ukeire = Array.from(waitMap.values()).reduce(
      (sum, count) => sum + count,
      0,
    );

    const discardTile = internalToTile(discard);
    discardOptions.set(discardTile, {
      discard: discardTile,
      shanten: result.now,
      ukeire,
      tiles: tileToExternalFormat(waitMap),
    });

    if (
      ukeire > bestUkeire ||
      (ukeire === bestUkeire && waitMap.size > bestTiles.size)
    ) {
      bestUkeire = ukeire;
      bestTiles = waitMap;
    }
  }

  return {
    shanten: bestShanten,
    ukeire: bestUkeire,
    tiles: tileToExternalFormat(bestTiles),
    discardOptions,
  };
};
