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
    expect(result.scoreInfo.bakaze).toBe('E');
    expect(result.scoreInfo.jikaze).toBe('S');
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
