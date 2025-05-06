import { Ankan, StartKyoku, Tile, Tsumo } from '@mjai/types';
import { describe, expect, it } from 'vitest';

import { TehaiState } from '../TehaiState';

type initialHand = [
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
];

const mockStartKyoku = (testHand: initialHand): StartKyoku => {
  return {
    type: 'start_kyoku',
    bakaze: 'E',
    doraMarker: '1m',
    kyoku: 0,
    honba: 0,
    kyotaku: 0,
    oya: '0',
    scores: [25000, 25000, 25000, 25000],
    tehais: [testHand, testHand, testHand, testHand],
  };
};

describe('test Ankan event', () => {
  it('should ankan from tsumo', () => {
    const startHand: initialHand = [
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
    const startKyoku = mockStartKyoku(startHand);
    const tehaiState = TehaiState(startKyoku);
    const tsumoEvent: Tsumo = {
      type: 'tsumo',
      actor: '0',
      pai: '1m',
    };
    tehaiState.handle(tsumoEvent);

    const anKanEven: Ankan = {
      type: 'ankan',
      actor: '0',
      consumed: ['1m', '1m', '1m', '1m'],
    };
    tehaiState.handle(anKanEven);

    const actual = tehaiState.get()[0];
    expect(actual.tehai).toEqual([
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
    ]);
    expect(actual.tsumo).toEqual(null);
    expect(actual.fuuros).toEqual([
      {
        type: 'ankan',
        actor: '0',
        consumed: ['1m', '1m', '1m', '1m'],
      },
    ]);
  });
});

describe('test Tsumo event', () => {
  it('should tsumo', () => {
    const startHand: initialHand = [
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
      '3p',
      '4p',
    ];
    const startKyoku = mockStartKyoku(startHand);
    const tehaiState = TehaiState(startKyoku);

    const tsumoEvent: Tsumo = {
      type: 'tsumo',
      actor: '0',
      pai: '5m',
    };
    tehaiState.handle(tsumoEvent);

    const actual = tehaiState.get()[0];
    expect(actual.tehai).toEqual(startHand);
    expect(actual.tsumo).toEqual('5m');
  });
});
