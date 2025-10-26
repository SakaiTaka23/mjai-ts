import { describe, expect, it } from 'vitest';

import { PlayerID, ReachAccepted, StartKyoku, Tile } from '@types';

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
      isChankanRinshan: false,
      isTenChiho: [true, true, true, true],
      reachPlayers: new Set<{
        playerId: PlayerID;
        isIpatsu: boolean;
        isDoubleReach: boolean;
        uraDora: Tile[];
      }>([]),
      horaPlayers: new Set<{
        playerId: PlayerID;
        targetPlayerId: PlayerID;
        isRon: boolean;
        horaTile: Tile;
        deltas: [number, number, number, number];
      }>([]),
      junme: 0,
    });
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
    expect(kyokuState.reachPlayers()).toEqual(
      new Set<{
        playerId: PlayerID;
        isIpatsu: boolean;
        isDoubleReach: boolean;
      }>([
        {
          playerId: 0,
          isIpatsu: true,
          isDoubleReach: true,
        },
      ]),
    );
  });

  it('should cancel ipatsu on naki', () => {
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

    kyokuState.handle({
      type: 'pon',
      actor: 2,
      target: 1,
      pai: '5m',
      consumed: ['5m', '5m'],
    });

    const rp = Array.from(kyokuState.reachPlayers())[0];
    expect(rp.playerId).toBe(0);
    expect(rp.isIpatsu).toBe(false);
    expect(rp.isDoubleReach).toBe(true);
  });

  it('should cancel ipatsu on dahai', () => {
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

    kyokuState.handle({
      type: 'dahai',
      actor: 0,
      pai: '1p',
      tsumogiri: true,
    });

    const rp = Array.from(kyokuState.reachPlayers())[0];
    expect(rp.playerId).toBe(0);
    expect(rp.isIpatsu).toBe(false);
    expect(rp.isDoubleReach).toBe(true);
  });
});

describe('Oya dahai should increase junme', () => {
  it('should increase junme when oya dahai event is handled', () => {
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
      type: 'dahai',
      actor: 0,
      pai: '1m',
      tsumogiri: false,
    });
    expect(kyokuState.junme()).toEqual(1);
  });
});

describe('tenho chiho events', () => {
  it('should cancel tenho chiho on naki', () => {
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
      type: 'ankan',
      actor: 0,
      consumed: ['4s', '4s', '4s', '4s'],
    });
    const tenchiho = kyokuState.isTenChiho();
    expect(tenchiho).toEqual([false, false, false, false]);
  });
});

describe('chankan rinshan events', () => {
  it('should set chankan rinshan on ankan', () => {
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
      type: 'ankan',
      actor: 0,
      consumed: ['4s', '4s', '4s', '4s'],
    });
    expect(kyokuState.isChankanRinshan()).toBe(true);

    kyokuState.handle({
      type: 'dahai',
      actor: 1,
      pai: '3p',
      tsumogiri: true,
    });
    expect(kyokuState.isChankanRinshan()).toBe(false);
  });
});

describe('ko dahai should not increase junme', () => {
  it('should not increase junme when non-oya dahai event is handled', () => {
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
      type: 'dahai',
      actor: 1,
      pai: '1m',
      tsumogiri: false,
    });
    expect(kyokuState.junme()).toEqual(0);
  });
});

describe('hora event', () => {
  it('should add uradora on reach hora', () => {
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
    kyokuState.handle({
      type: 'dahai',
      actor: 1,
      pai: '7m',
      tsumogiri: false,
    });
    kyokuState.handle({
      type: 'hora',
      actor: 0,
      target: 1,
      deltas: [2600, -2600, 0, 0],
      uraMarkers: ['2m', '3m'],
    });
    const hora = kyokuState.horaPlayers();
    expect(hora.size).toBe(1);
    const hp = Array.from(hora)[0];
    expect(hp.playerId).toBe(0);
    expect(hp.targetPlayerId).toBe(1);
    expect(hp.isRon).toBe(true);
    expect(hp.horaTile).toBe('7m');
    expect(hp.uraDora).toEqual(['2m', '3m']);
    expect(hp.deltas).toEqual([2600, -2600, 0, 0]);
  });

  it('should handle non-reach tsumo hora', () => {
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
    kyokuState.handle({
      type: 'tsumo',
      actor: 0,
      pai: '7m',
    });
    kyokuState.handle({
      type: 'hora',
      actor: 0,
      target: 0,
      deltas: [12000, -4000, -4000, -4000],
      uraMarkers: [],
    });

    const hora = kyokuState.horaPlayers();
    expect(hora.size).toBe(1);
    const hp = Array.from(hora)[0];
    expect(hp.playerId).toBe(0);
    expect(hp.targetPlayerId).toBe(0);
    expect(hp.isRon).toBe(false);
    expect(hp.horaTile).toBe('7m');
    expect(hp.uraDora).toEqual([]);
    expect(hp.deltas).toEqual([12000, -4000, -4000, -4000]);
  });
});
