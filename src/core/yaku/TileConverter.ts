import { Tile, Wind } from '@types';

import { Fuuro } from '../types/Tehai';

const ConvertTile = (tile: Tile | Tile[]): string => {
  if (Array.isArray(tile)) {
    return tile.map((t) => ConvertTile(t)).join('');
  }

  switch (tile) {
    case '5mr':
      return '0m';
    case '5pr':
      return '0p';
    case '5sr':
      return '0s';
    case 'E':
      return '1z';
    case 'S':
      return '2z';
    case 'W':
      return '3z';
    case 'N':
      return '4z';
    case 'P':
      return '5z';
    case 'F':
      return '6z';
    case 'C':
      return '7z';
    default:
      return tile;
  }
};

const ConvertFuuro = (fuuro: Fuuro): string => {
  switch (fuuro.type) {
    case 'ankan': {
      const unique = [...new Set(fuuro.consumed)];
      if (unique.length >= 2) {
        return ConvertTile(unique[0]) + ConvertTile(unique[1]);
      }
      return ConvertTile(unique[0]) + ConvertTile(unique[0]);
    }
    case 'chi':
    case 'daiminkan':
    case 'kakan':
    case 'pon':
      return ConvertTile(fuuro.pai) + ConvertTile(fuuro.consumed);
  }
};

const ConvertHand = (
  tehai: Tile[],
  fuuro: Fuuro[],
  horaTile: Tile,
  isRon: boolean,
): string => {
  let tiles = tehai.map((tile) => ConvertTile(tile)).join('');
  if (isRon) {
    tiles += `+${ConvertTile(horaTile)}`;
  } else {
    tiles += ConvertTile(horaTile);
  }

  if (fuuro.length === 0) {
    return tiles;
  }
  const fuuros = fuuro.map((fuuro) => ConvertFuuro(fuuro)).join('');
  return `${tiles}+${fuuros}`;
};

const windMap: [Wind, Wind, Wind, Wind] = ['E', 'S', 'W', 'N'];
const ConvertWind = (wind: Wind): string => {
  return windMap.indexOf(wind).toString();
};

const ConvertDora = (dora: Tile[]): string => {
  return `d${dora.map((tile) => ConvertTile(tile)).join('')}`;
};

const ConvertUraDora = (uraDora: Tile[]): string | null => {
  if (uraDora.length === 0) {
    return null;
  }
  return `u${uraDora.map((tile) => ConvertTile(tile)).join('')}`;
};

const ConvertExtra = (
  isTenchiho: boolean,
  isDoubleReach: boolean,
  isIpatsu: boolean,
  isReach: boolean,
  isHaiteiHotei: boolean,
  isChankanRinshan: boolean,
  bakaaze: Wind,
  zikaze: Wind,
): string => {
  const extras = '';
  const bakazeExtra = ConvertWind(bakaaze);
  const jikazeExtra = ConvertWind(zikaze);

  if (isTenchiho) {
    return extras + 't';
  }
  if (isDoubleReach) {
    return extras + 'w';
  }
  if (isIpatsu) {
    return extras + 'i';
  }
  if (isReach) {
    return extras + 'r';
  }
  if (isHaiteiHotei) {
    return extras + 'h';
  }
  if (isChankanRinshan) {
    return extras + 'k';
  }

  return `${extras}${bakazeExtra}${jikazeExtra}`;
};

export const ConvertFull = (
  tehai: Tile[],
  fuuro: Fuuro[],
  horaTile: Tile,
  isRon: boolean,
  dora: Tile[],
  uraDora: Tile[],
  isTenchiho: boolean,
  isDoubleReach: boolean,
  isIpatsu: boolean,
  isReach: boolean,
  isHaiteiHotei: boolean,
  isChankanRinshan: boolean,
  bakaaze: Wind,
  zikaze: Wind,
): string => {
  const handPart = ConvertHand(tehai, fuuro, horaTile, isRon);
  const doraPart = ConvertDora(dora);
  const uraDoraPart = ConvertUraDora(uraDora);
  const extraPart = ConvertExtra(
    isTenchiho,
    isDoubleReach,
    isIpatsu,
    isReach,
    isHaiteiHotei,
    isChankanRinshan,
    bakaaze,
    zikaze,
  );

  if (uraDoraPart === null) {
    return `${handPart}+${doraPart}+${extraPart}`;
  }
  return `${handPart}+${doraPart}+${uraDoraPart}+${extraPart}`;
};
