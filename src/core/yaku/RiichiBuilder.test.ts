import { describe, expect, it } from 'vitest';

import { createRiichiFromParams } from './RiichiBuilder';
import { assertAgariResult } from './TestHelper';

describe('Basic Examples from params', () => {
  it('usage', () => {
    const riichi = createRiichiFromParams(
      [
        '1m',
        '1m',
        '2m',
        '2m',
        '3m',
        '3m',
        '4m',
        '5m',
        '6m',
        '7m',
        '8m',
        '9m',
        '1s',
      ],
      [],
      '1s',
      false,
      ['5p'],
      [],
      false,
      false,
      false,
      false,
      false,
      false,
      'S',
      'W',
    );

    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(0);
    expect(result.han).toBe(4);
    expect(result.fu).toBe(30);
    expect(result.ten).toBe(7900);
    expect(result.name).toBe('');
    expect(result.error).toBe(false);
    expect(result.scoreInfo.bakaze).toBe('S');
    expect(result.scoreInfo.jikaze).toBe('W');
    expect(result.scoreInfo.agariType).toBe('tsumo');
    expect(result.payment.type).toBe('tsumo');
    if (result.payment.type === 'tsumo') {
      expect(result.payment.fromOya).toBe(3900);
      expect(result.payment.fromKo).toBe(2000);
    }
    // 役の確認
    expect(result.yaku).toContainEqual({
      name: '一気通貫',
      value: { type: 'han', count: 2 },
    });
    expect(result.yaku).toContainEqual({
      name: '一盃口',
      value: { type: 'han', count: 1 },
    });
    expect(result.yaku).toContainEqual({
      name: '門前清自摸和',
      value: { type: 'han', count: 1 },
    });
  });
});

describe('Test Builder Fuuro conversion', () => {
  it('chi conversion', () => {
    const riichi = createRiichiFromParams(
      ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '1s'],
      [{ type: 'chi', actor: 1, target: 0, pai: '2m', consumed: ['1m', '3m'] }],
      '1s',
    );
    const result = riichi.calc();
    assertAgariResult(result);
    expect(riichi.rawString()).toBe('1m2m3m4m5m6m7m8m9m1s1s+123m+11');
  });

  it('chi conversion with aka', () => {
    const riichi = createRiichiFromParams(
      ['1m', '1m', '2m', '2m', '3m', '3m', '7m', '8m', '9m', '1s'],
      [
        {
          type: 'chi',
          actor: 1,
          target: 0,
          pai: '5mr',
          consumed: ['4m', '6m'],
        },
      ],
      '1s',
    );
    const result = riichi.calc();
    expect(riichi.rawString()).toBe('1m1m2m2m3m3m7m8m9m1s1s+406m+11');
    assertAgariResult(result);
  });

  it('ankan conversion', () => {
    const riichi = createRiichiFromParams(
      ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '1s'],
      [{ type: 'ankan', actor: 0, consumed: ['E', 'E', 'E', 'E'] }],
      '1s',
    );
    const result = riichi.calc();
    assertAgariResult(result);
    expect(riichi.rawString()).toBe('1m2m3m4m5m6m7m8m9m1s1s+11z+11');
  });

  it('ankan conversion with aka', () => {
    const riichi = createRiichiFromParams(
      ['1m', '2m', '3m', '4m', '6m', '6m', '7m', '7m', '8m', '8m'],
      [{ type: 'ankan', actor: 0, consumed: ['5m', '5m', '5mr', '5m'] }],
      '1m',
    );
    const result = riichi.calc();
    assertAgariResult(result);
    expect(riichi.rawString()).toBe('1m2m3m4m6m6m7m7m8m8m1m+50m+11');
  });

  it('pon conversion', () => {
    const riichi = createRiichiFromParams(
      ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '1s'],
      [{ type: 'pon', actor: 0, target: 1, pai: 'E', consumed: ['E', 'E'] }],
      '1s',
    );
    const result = riichi.calc();
    assertAgariResult(result);
    expect(riichi.rawString()).toBe('1m2m3m4m5m6m7m8m9m1s1s+111z+11');
  });

  it('pon conversion with aka', () => {
    const riichi = createRiichiFromParams(
      ['1m', '2m', '3m', '4m', '6m', '6m', '7m', '7m', '8m', '8m'],
      [
        {
          type: 'pon',
          actor: 0,
          target: 1,
          pai: '5mr',
          consumed: ['5m', '5m'],
        },
      ],
      '1m',
    );
    const result = riichi.calc();
    assertAgariResult(result);
    expect(riichi.rawString()).toBe('1m2m3m4m6m6m7m7m8m8m1m+505m+11');
  });

  it('daiminkan conversion', () => {
    const riichi = createRiichiFromParams(
      ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '1s'],
      [
        {
          type: 'daiminkan',
          actor: 0,
          target: 1,
          pai: 'E',
          consumed: ['E', 'E', 'E'],
        },
      ],
      '1s',
    );
    const result = riichi.calc();
    assertAgariResult(result);
    expect(riichi.rawString()).toBe('1m2m3m4m5m6m7m8m9m1s1s+1111z+11');
  });

  it('daiminkan conversion with aka', () => {
    const riichi = createRiichiFromParams(
      ['1m', '2m', '3m', '4m', '6m', '6m', '7m', '7m', '8m', '8m'],
      [
        {
          type: 'daiminkan',
          actor: 0,
          target: 1,
          pai: '5mr',
          consumed: ['5m', '5m', '5m'],
        },
      ],
      '1m',
    );
    const result = riichi.calc();
    assertAgariResult(result);
    expect(riichi.rawString()).toBe('1m2m3m4m6m6m7m7m8m8m1m+5055m+11');
  });

  it('kakan conversion', () => {
    const riichi = createRiichiFromParams(
      ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '1s'],
      [
        {
          type: 'kakan',
          actor: 0,
          ponTarget: 1,
          ponPai: 'E',
          ponConsumed: ['E', 'E'],
          pai: 'E',
          consumed: ['E', 'E', 'E'],
        },
      ],
      '1s',
    );
    const result = riichi.calc();
    assertAgariResult(result);
    expect(riichi.rawString()).toBe('1m2m3m4m5m6m7m8m9m1s1s+1111z+11');
  });

  it('kakan conversion with aka', () => {
    const riichi = createRiichiFromParams(
      ['1m', '2m', '3m', '4m', '6m', '6m', '7m', '7m', '8m', '8m'],
      [
        {
          type: 'kakan',
          actor: 0,
          ponTarget: 1,
          ponPai: '5mr',
          ponConsumed: ['5m', '5m'],
          pai: '5mr',
          consumed: ['5m', '5m', '5m'],
        },
      ],
      '1m',
    );
    const result = riichi.calc();
    assertAgariResult(result);
    expect(riichi.rawString()).toBe('1m2m3m4m6m6m7m7m8m8m1m+5055m+11');
  });
});
