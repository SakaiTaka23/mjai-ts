import { PlayerID, ReachAccepted, StartKyoku, Tile } from '@mjai/types';
import { describe, expect, it } from 'vitest';

import { KyokuState } from '../KyokuState';

interface managed {
  kyoku: number;
  honba: number;
  kyotaku: number;
  bakaze: 'E' | 'S' | 'W';
  oya: PlayerID;
}

const mockStartKyoku = (initialKyoku: managed): StartKyoku => {
  const startHand: [
    Tile,
    Tile,
    Tile,
    Tile,
    Tile,
    Tile,
    Tile,
    Tile,
    Tile,
    Tile,
    Tile,
    Tile,
    Tile,
  ] = [
    '1m',
    '1m',
    '1m',
    '2m',
    '3m',
    '4m',
    '5m',
    '6m',
    '7m',
    '8m',
    '9m',
    '1p',
    '2p',
  ];
  return {
    type: 'start_kyoku',
    bakaze: initialKyoku.bakaze,
    doraMarker: '1m',
    kyoku: initialKyoku.kyoku,
    honba: initialKyoku.honba,
    kyotaku: initialKyoku.kyotaku,
    oya: initialKyoku.oya,
    scores: [25000, 25000, 25000, 25000],
    tehais: [startHand, startHand, startHand, startHand],
  };
};

describe('Kyoku State', () => {
  it('should create instance from start kyoku', () => {
    const initialKyoku = {
      kyoku: 1,
      honba: 7,
      kyotaku: 3,
      bakaze: 'E',
      oya: 0,
    } as managed;
    const startKyoku = mockStartKyoku(initialKyoku);
    const kyokuState = KyokuState(startKyoku);

    expect(kyokuState.get()).toEqual({
      kyoku: initialKyoku.kyoku,
      honba: initialKyoku.honba,
      kyotaku: initialKyoku.kyotaku,
      bakaze: initialKyoku.bakaze,
      oya: initialKyoku.oya,
    });

    expect(kyokuState.kyoku()).toEqual(initialKyoku.kyoku);
    expect(kyokuState.honba()).toEqual(initialKyoku.honba);
    expect(kyokuState.kyotaku()).toEqual(initialKyoku.kyotaku);
    expect(kyokuState.bakaze()).toEqual(initialKyoku.bakaze);
    expect(kyokuState.oya()).toEqual(initialKyoku.oya);
  });
});

describe('Reach accepted event', () => {
  it('should handle reach accepted event', () => {
    const initialKyoku = {
      kyoku: 1,
      honba: 7,
      kyotaku: 3,
      bakaze: 'E',
      oya: 0,
    } as managed;
    const startKyoku = mockStartKyoku(initialKyoku);
    const kyokuState = KyokuState(startKyoku);
    kyokuState.handle({
      type: 'reach_accepted',
      actor: 0,
    } as ReachAccepted);

    expect(kyokuState.kyotaku()).toEqual(initialKyoku.kyotaku + 1);
  });
});
