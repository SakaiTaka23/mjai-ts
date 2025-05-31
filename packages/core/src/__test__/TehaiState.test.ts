import {
  Ankan,
  Chi,
  Dahai,
  Daiminkan,
  Kakan,
  Pon,
  StartKyoku,
  Tile,
  Tsumo,
} from '@mjai/types';
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
    oya: 0,
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
      actor: 0,
      pai: '1m',
    };
    tehaiState.handle(tsumoEvent);

    const anKanEven: Ankan = {
      type: 'ankan',
      actor: 0,
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
        actor: 0,
        consumed: ['1m', '1m', '1m', '1m'],
      },
    ]);
  });
});

describe('test Chi event', () => {
  it('should chi', () => {
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

    const chiEvent: Chi = {
      type: 'chi',
      actor: 0,
      target: 1,
      pai: '3p',
      consumed: ['1p', '2p'],
    };
    tehaiState.handle(chiEvent);

    const actual = tehaiState.get()[0];
    expect(actual.tehai).toEqual([
      '1m',
      '2m',
      '3m',
      '4m',
      '5m',
      '6m',
      '7m',
      '8m',
      '9m',
      '3p',
      '4p',
    ]);
    expect(actual.fuuros).toEqual([
      {
        type: 'chi',
        actor: 0,
        target: 1,
        pai: '3p',
        consumed: ['1p', '2p'],
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
      actor: 0,
      pai: '5m',
    };
    tehaiState.handle(tsumoEvent);

    const actual = tehaiState.get()[0];
    expect(actual.tehai).toEqual(startHand);
    expect(actual.tsumo).toEqual('5m');
  });
});

describe('test Dahai event', () => {
  it('should dashi', () => {
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
      actor: 0,
      pai: '5p',
    };
    tehaiState.handle(tsumoEvent);

    const dahaiEvent: Dahai = {
      type: 'dahai',
      actor: 0,
      pai: '5p',
      tsumogiri: true,
    };
    tehaiState.handle(dahaiEvent);

    const actual = tehaiState.get()[0];
    expect(actual.tehai).toEqual([
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
    ]);
    expect(actual.tsumo).toEqual(null);
    expect(actual.fuuros).toEqual([]);
  });
});

describe('test Daiminkan event', () => {
  it('should daiminkan', () => {
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

    const daiminkanEvent: Daiminkan = {
      type: 'daiminkan',
      actor: 0,
      target: 1,
      pai: '1m',
      consumed: ['1m', '1m', '1m'],
    };
    tehaiState.handle(daiminkanEvent);

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
    expect(actual.fuuros).toEqual([
      {
        type: 'daiminkan',
        actor: 0,
        target: 1,
        pai: '1m',
        consumed: ['1m', '1m', '1m'],
      },
    ]);
  });
});

describe('test Kakan event', () => {
  it('should kakan from tsumo', () => {
    const startHand: initialHand = [
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
      '3p',
    ];
    const startKyoku = mockStartKyoku(startHand);
    const tehaiState = TehaiState(startKyoku);

    const ponEvent: Pon = {
      type: 'pon',
      actor: 0,
      target: 1,
      pai: '1m',
      consumed: ['1m', '1m'],
    };
    tehaiState.handle(ponEvent);

    const tsumoEvent: Tsumo = {
      type: 'tsumo',
      actor: 0,
      pai: '1m',
    };
    tehaiState.handle(tsumoEvent);

    const kakanEvent: Kakan = {
      type: 'kakan',
      actor: 0,
      pai: '1m',
      consumed: ['1m', '1m', '1m'],
    };
    tehaiState.handle(kakanEvent);

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
      '3p',
    ]);
    expect(actual.tsumo).toEqual(null);
    expect(actual.fuuros).toEqual([
      {
        type: 'kakan',
        actor: 0,
        pai: '1m',
        consumed: ['1m', '1m', '1m'],
        ponTarget: 1,
        ponPai: '1m',
        ponConsumed: ['1m', '1m'],
      },
    ]);
  });

  it('should kakan from tehai', () => {
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

    const ponEvent: Pon = {
      type: 'pon',
      actor: 0,
      target: 1,
      pai: '1m',
      consumed: ['1m', '1m'],
    };
    tehaiState.handle(ponEvent);

    const tsumoEvent: Tsumo = {
      type: 'tsumo',
      actor: 0,
      pai: '4m',
    };
    tehaiState.handle(tsumoEvent);

    const kakanEvent: Kakan = {
      type: 'kakan',
      actor: 0,
      pai: '1m',
      consumed: ['1m', '1m', '1m'],
    };
    tehaiState.handle(kakanEvent);

    const actual = tehaiState.get()[0];
    expect(actual.tehai).toEqual([
      '2m',
      '3m',
      '4m',
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
        type: 'kakan',
        actor: 0,
        pai: '1m',
        consumed: ['1m', '1m', '1m'],
        ponTarget: 1,
        ponPai: '1m',
        ponConsumed: ['1m', '1m'],
      },
    ]);
  });
});

describe('test Pon event', () => {
  it('should pon', () => {
    const startHand: initialHand = [
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
      '3p',
    ];
    const startKyoku = mockStartKyoku(startHand);
    const tehaiState = TehaiState(startKyoku);

    const ponEvent: Pon = {
      type: 'pon',
      actor: 0,
      target: 1,
      pai: '1m',
      consumed: ['1m', '1m'],
    };
    tehaiState.handle(ponEvent);

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
      '3p',
    ]);
    expect(actual.fuuros).toEqual([
      {
        type: 'pon',
        actor: 0,
        target: 1,
        pai: '1m',
        consumed: ['1m', '1m'],
      },
    ]);
  });
});
