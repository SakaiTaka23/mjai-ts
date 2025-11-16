import { describe, expect, it } from 'vitest';

import { Dora, StartKyoku, Tile } from '@types';

import { DoraState } from './DoraState';

const mockStartKyoku = (initialDora: Tile): StartKyoku => {
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
    bakaze: 'E',
    doraMarker: initialDora,
    kyoku: 0,
    honba: 0,
    kyotaku: 0,
    oya: 0,
    scores: [25000, 25000, 25000, 25000],
    tehais: [startHand, startHand, startHand, startHand],
  };
};

describe('Dora State', () => {
  it('should create instance from start kyoku', () => {
    const startKyoku = mockStartKyoku('1m');
    const doraState = DoraState(startKyoku);

    expect(doraState.get()).toEqual(['1m']);
    expect(doraState.getActualDora()).toEqual(['2m']);
  });

  it('should add dora in dora event', () => {
    const startKyoku = mockStartKyoku('1m');
    const doraState = DoraState(startKyoku);

    const doraEvent: Dora = {
      type: 'dora',
      doraMarker: '5p',
    };
    doraState.handle(doraEvent);

    expect(doraState.get()).toEqual(['1m', '5p']);
    expect(doraState.getActualDora()).toEqual(['2m', '6p']);
  });
});
