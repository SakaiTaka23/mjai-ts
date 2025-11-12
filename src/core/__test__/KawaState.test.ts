import { describe, expect, it } from 'vitest';

import { Chi, Dahai, Reach, ReachAccepted, Tsumo } from '@types';

import { KawaState } from '../KawaState';

describe('Kawa State', () => {
  it('should init kawa', () => {
    const kawaState = KawaState();

    const actual = kawaState.get();
    expect(actual.kawas).toEqual([
      {
        sutehai: [],
        nakiIndex: [],
        reachIndex: null,
      },
      {
        sutehai: [],
        nakiIndex: [],
        reachIndex: null,
      },
      {
        sutehai: [],
        nakiIndex: [],
        reachIndex: null,
      },
      {
        sutehai: [],
        nakiIndex: [],
        reachIndex: null,
      },
    ]);
    expect(actual.remaining).toEqual(70);
    expect(actual.isHaiteiHotei).toBe(false);
  });

  it('should dahai', () => {
    const kawaState = KawaState();

    const dahaiEvent: Dahai = {
      type: 'dahai',
      actor: 0,
      pai: '1m',
      tsumogiri: true,
    };
    kawaState.handle(dahaiEvent);

    const actual = kawaState.get();
    expect(actual.kawas[0].sutehai).toEqual(['1m']);
  });

  it('should dahai with reach', () => {
    const kawaState = KawaState();

    const reachEvent: Reach = {
      type: 'reach',
      actor: 0,
    };
    kawaState.handle(reachEvent);

    const dahaiEvent: Dahai = {
      type: 'dahai',
      actor: 0,
      pai: '5m',
      tsumogiri: true,
    };
    kawaState.handle(dahaiEvent);

    const actual = kawaState.get();
    expect(actual.kawas[0].sutehai).toEqual(['5m']);
    expect(actual.kawas[0].reachIndex).toEqual(0);
  });

  it('should tsumo', () => {
    const kawaState = KawaState();

    const tsumoEvent: Tsumo = {
      type: 'tsumo',
      actor: 0,
      pai: '1m',
    };
    kawaState.handle(tsumoEvent);

    const actual = kawaState.get();
    expect(actual.kawas).toEqual([
      {
        sutehai: [],
        nakiIndex: [],
        reachIndex: null,
      },
      {
        sutehai: [],
        nakiIndex: [],
        reachIndex: null,
      },
      {
        sutehai: [],
        nakiIndex: [],
        reachIndex: null,
      },
      {
        sutehai: [],
        nakiIndex: [],
        reachIndex: null,
      },
    ]);
    expect(actual.remaining).toEqual(69);
  });

  it('should naki', () => {
    const kawaState = KawaState();

    const dahaiEvent: Dahai = {
      type: 'dahai',
      actor: 1,
      pai: '4m',
      tsumogiri: true,
    };
    kawaState.handle(dahaiEvent);

    const chiEvent: Chi = {
      type: 'chi',
      actor: 0,
      target: 1,
      pai: '4m',
      consumed: ['2m', '3m'],
    };
    kawaState.handle(chiEvent);

    const actual = kawaState.get();
    expect(actual.kawas[1].nakiIndex).toEqual([0]);
  });

  it('should reach', () => {
    const kawaState = KawaState();

    const reachEvent: Reach = {
      type: 'reach',
      actor: 0,
    };
    kawaState.handle(reachEvent);

    const actual = kawaState.get();
    expect(actual.kawas[0].reachIndex).toEqual(null);
  });

  it('should reach accepted', () => {
    const kawaState = KawaState();

    const reachEvent: Reach = {
      type: 'reach',
      actor: 0,
    };
    kawaState.handle(reachEvent);

    const dahaiEvent: Dahai = {
      type: 'dahai',
      actor: 0,
      pai: '5m',
      tsumogiri: false,
    };
    kawaState.handle(dahaiEvent);

    const reachAcceptedEvent: ReachAccepted = {
      type: 'reach_accepted',
      actor: 0,
    };
    kawaState.handle(reachAcceptedEvent);

    const actual = kawaState.get();
    expect(actual.kawas[0].reachIndex).toEqual(0);
  });
});
