import { PlayerID, Tile, Wind } from '@types';

import { Riichi } from './Riichi';
import { GameState } from '../GameState';
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

const formatContinuousTiles = (tiles: Tile[]): string => {
  const converted = tiles.map((tile) => ConvertTile(tile));
  // 0 must be treated as 5 when converting since it is 5 aka
  const sorted = converted.sort((a, b) => {
    const numA = a.startsWith('0') ? 5 : parseInt(a[0]);
    const numB = b.startsWith('0') ? 5 : parseInt(b[0]);
    return numA - numB;
  });
  const nums = sorted.map((c) => c.slice(0, -1)).join('');
  const suit = sorted[0].slice(-1);
  return nums + suit;
};

const formatSameTiles = (tiles: Tile[], repeatCount: 2 | 3 | 4): string => {
  const unique = [...new Set(tiles)];
  const converted = unique.map((tile) => ConvertTile(tile));
  const nums = converted
    .map((c) => c.slice(0, -1))
    // This is to guarantee that 0 comes after all the other tile numbers
    .sort((a, b) => Number(b) - Number(a));
  const suit = converted[0].slice(-1);
  let result = '';

  if (nums.length === 1) {
    result += nums[0].repeat(2);
  } else {
    result += nums.join('');
  }

  return (result += nums[0].repeat(repeatCount - 2) + suit);
};

const ConvertFuuro = (fuuro: Fuuro): string => {
  switch (fuuro.type) {
    case 'chi':
      return formatContinuousTiles([fuuro.pai, ...fuuro.consumed]);
    case 'ankan':
      return formatSameTiles(fuuro.consumed, 2);
    case 'pon':
      return formatSameTiles([fuuro.pai, ...fuuro.consumed], 3);
    case 'daiminkan':
    case 'kakan':
      return formatSameTiles([fuuro.pai, ...fuuro.consumed], 4);
  }
};

const ConvertHand = (
  tehai: Tile[],
  fuuro: Fuuro[],
  horaTile: Tile | null,
  isRon: boolean,
): string => {
  let tiles = tehai.map((tile) => ConvertTile(tile)).join('');
  if (horaTile !== null) {
    if (isRon) {
      tiles += `+${ConvertTile(horaTile)}`;
    } else {
      tiles += ConvertTile(horaTile);
    }
  }

  if (fuuro.length === 0) {
    return tiles;
  }
  const fuuros = fuuro.map((fuuro) => ConvertFuuro(fuuro)).join('');
  return `${tiles}+${fuuros}`;
};

const windMap: [Wind, Wind, Wind, Wind] = ['E', 'S', 'W', 'N'];
const ConvertWind = (wind: Wind): string => {
  return (windMap.indexOf(wind) + 1).toString();
};

const ConvertDora = (dora: Tile[]): string | null => {
  if (dora.length === 0) {
    return null;
  }
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
  let extras = '';
  const bakazeExtra = ConvertWind(bakaaze);
  const jikazeExtra = ConvertWind(zikaze);

  if (isTenchiho) {
    extras += 't';
  }
  if (isDoubleReach) {
    extras += 'w';
  }
  if (isIpatsu) {
    extras += 'i';
  }
  if (isReach) {
    extras += 'r';
  }
  if (isHaiteiHotei) {
    extras += 'h';
  }
  if (isChankanRinshan) {
    extras += 'k';
  }

  return `${extras}${bakazeExtra}${jikazeExtra}`;
};

export const createRiichiFromParams = (
  tehai: Tile[],
  fuuro: Fuuro[],
  horaTile: Tile | null = null,
  isRon = false,
  dora: Tile[] = [],
  uraDora: Tile[] = [],
  isTenchiho = false,
  isDoubleReach = false,
  isIpatsu = false,
  isReach = false,
  isHaiteiHotei = false,
  isChankanRinshan = false,
  bakaaze: Wind = 'E',
  zikaze: Wind = 'E',
): Riichi => {
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

  let rawString = `${handPart}`;
  if (doraPart !== null) {
    rawString += `+${doraPart}`;
  }
  if (uraDoraPart !== null) {
    rawString += `+${uraDoraPart}`;
  }
  return new Riichi(`${rawString}+${extraPart}`);
};

export const createRiichiFromState = (
  state: GameState,
  playerID: PlayerID,
): Riichi => {
  const hand = state.TehaiState.get()[playerID];
  const hora = state.KyokuState.horaPlayers();
  const horaPlayer = Array.from(hora).find((hp) => hp.playerId === playerID);
  let horaTile: Tile | null = null;
  let isRon = false;
  let uraDora: Tile[] = [];
  if (horaPlayer) {
    horaTile = horaPlayer.horaTile;
    if (horaPlayer.playerId !== horaPlayer.targetPlayerId) {
      isRon = true;
    }
    uraDora = horaPlayer.uraDora;
  }
  const dora = state.DoraState.getActualDora();
  const riichi = state.KyokuState.reachPlayers();
  const riichiPlayer = Array.from(riichi).find(
    (rp) => rp.playerId === playerID,
  );
  const isTenchiho = state.KyokuState.isTenChiho().at(playerID)!;
  const isDoubleReach = riichiPlayer ? riichiPlayer.isDoubleReach : false;
  const isIpatsu = riichiPlayer ? riichiPlayer.isIpatsu : false;
  const isReach = riichiPlayer !== undefined;
  const isHaiteiHotei = state.KawaState.isHaiteiHotei();
  const isChankanRinshan = state.KyokuState.isChankanRinshan();

  return createRiichiFromParams(
    hand.tehai,
    hand.fuuros,
    horaTile,
    isRon,
    dora,
    uraDora,
    isTenchiho,
    isDoubleReach,
    isIpatsu,
    isReach,
    isHaiteiHotei,
    isChankanRinshan,
    state.KyokuState.bakaze(),
    state.KyokuState.wind(playerID),
  );
};
