import { describe, expect, it } from 'vitest';

import { StartKyoku, Tile } from '@types';

import { ScoreState } from '../ScoreState';

const mockStartKyoku = (
  initialScore: [number, number, number, number],
): StartKyoku => {
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
    doraMarker: '1m',
    kyoku: 0,
    honba: 0,
    kyotaku: 0,
    oya: 0,
    scores: initialScore,
    tehais: [startHand, startHand, startHand, startHand],
  };
};

describe('Score State', () => {
  it('should create instance from start kyoku', () => {
    const startKyoku = mockStartKyoku([25000, 25000, 25000, 25000]);
    const scoreState = ScoreState(startKyoku);

    expect(scoreState.get()).toEqual([25000, 25000, 25000, 25000]);
  });

  it('should handle reach_accepted event', () => {
    const startKyoku = mockStartKyoku([25000, 25000, 25000, 25000]);
    const scoreState = ScoreState(startKyoku);

    scoreState.handle({
      type: 'reach_accepted',
      actor: 0,
    });

    expect(scoreState.get()).toEqual([24000, 25000, 25000, 25000]);
  });
});
