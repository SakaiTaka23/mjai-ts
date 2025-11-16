import { describe, it, expect } from 'vitest';

import { Riichi } from './Riichi';
import { assertAgariResult } from './TestHelper';
import { hasYaku, getYaku } from './YakuHelpers';
import { type YakuName, type AgariResult, CalcResultType } from './YakuTypes';

const expectYaku = (
  result: AgariResult,
  name: YakuName,
  expectedValue:
    | { type: 'han'; count: number }
    | { type: 'yakuman'; multiplier: 1 | 2 },
) => {
  expect(hasYaku(result.yaku, name)).toBe(true);
  const value = getYaku(result.yaku, name);
  expect(value).toEqual(expectedValue);
};

describe('Basic Examples', () => {
  it('usage', () => {
    const riichi = new Riichi('112233456789m11s');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.type).toBe('agari');
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

describe('役満 (Yakuman)', () => {
  it('国士無双', () => {
    const riichi = new Riichi('11m19p19s1234567z9m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(
      result.yaku.some(
        (y) =>
          y.name === '国士無双' &&
          y.value.type === 'yakuman' &&
          y.value.multiplier === 1,
      ),
    ).toBe(true);
  });

  it('国士無双十三面待ち', () => {
    const riichi = new Riichi('19m19p19s1234567z7z');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(2);
    expect(
      result.yaku.some(
        (y) =>
          y.name === '国士無双十三面待ち' &&
          y.value.type === 'yakuman' &&
          y.value.multiplier === 2,
      ),
    ).toBe(true);
  });

  it('九蓮宝燈', () => {
    const riichi = new Riichi('1111234678999m5m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(
      result.yaku.some(
        (y) =>
          y.name === '九蓮宝燈' &&
          y.value.type === 'yakuman' &&
          y.value.multiplier === 1,
      ),
    ).toBe(true);
  });

  it('純正九蓮宝燈', () => {
    const riichi = new Riichi('1112345678999m9m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(2);
    expect(
      result.yaku.some(
        (y) =>
          y.name === '純正九蓮宝燈' &&
          y.value.type === 'yakuman' &&
          y.value.multiplier === 2,
      ),
    ).toBe(true);
  });

  it('四暗刻', () => {
    const riichi = new Riichi('111222333m4455p4p');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(
      result.yaku.some(
        (y) =>
          y.name === '四暗刻' &&
          y.value.type === 'yakuman' &&
          y.value.multiplier === 1,
      ),
    ).toBe(true);
  });

  it('四暗刻単騎待ち', () => {
    const riichi = new Riichi('111222333444m55m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(2);
    expect(
      result.yaku.some(
        (y) =>
          y.name === '四暗刻単騎待ち' &&
          y.value.type === 'yakuman' &&
          y.value.multiplier === 2,
      ),
    ).toBe(true);
  });

  it('大三元', () => {
    const riichi = new Riichi('555666777z77p+111m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(
      result.yaku.some(
        (y) =>
          y.name === '大三元' &&
          y.value.type === 'yakuman' &&
          y.value.multiplier === 1,
      ),
    ).toBe(true);
  });

  it('小四喜', () => {
    const riichi = new Riichi('111222333z44z+555p');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(
      result.yaku.some(
        (y) =>
          y.name === '小四喜' &&
          y.value.type === 'yakuman' &&
          y.value.multiplier === 1,
      ),
    ).toBe(true);
  });

  it('大四喜', () => {
    const riichi = new Riichi('111222333z11p+444z');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(2);
    expect(
      result.yaku.some(
        (y) =>
          y.name === '大四喜' &&
          y.value.type === 'yakuman' &&
          y.value.multiplier === 2,
      ),
    ).toBe(true);
  });

  it('字一色', () => {
    const riichi = new Riichi('11122244466z+555z');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(
      result.yaku.some(
        (y) =>
          y.name === '字一色' &&
          y.value.type === 'yakuman' &&
          y.value.multiplier === 1,
      ),
    ).toBe(true);
  });

  it('緑一色', () => {
    const riichi = new Riichi('222333444s88s+666z');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(
      result.yaku.some(
        (y) =>
          y.name === '緑一色' &&
          y.value.type === 'yakuman' &&
          y.value.multiplier === 1,
      ),
    ).toBe(true);
  });

  it('清老頭', () => {
    const riichi = new Riichi('111999m11199s+999p');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(
      result.yaku.some(
        (y) =>
          y.name === '清老頭' &&
          y.value.type === 'yakuman' &&
          y.value.multiplier === 1,
      ),
    ).toBe(true);
  });

  it('四槓子', () => {
    const riichi = new Riichi('5z+1111m+2222p+3333s+4444z+5z');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(
      result.yaku.some(
        (y) =>
          y.name === '四槓子' &&
          y.value.type === 'yakuman' &&
          y.value.multiplier === 1,
      ),
    ).toBe(true);
  });

  it('天和', () => {
    const riichi = new Riichi('112233456789m11s+t1');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(
      result.yaku.some(
        (y) =>
          y.name === '天和' &&
          y.value.type === 'yakuman' &&
          y.value.multiplier === 1,
      ),
    ).toBe(true);
  });

  it('地和', () => {
    const riichi = new Riichi('112233456789m11s+t2');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(
      result.yaku.some(
        (y) =>
          y.name === '地和' &&
          y.value.type === 'yakuman' &&
          y.value.multiplier === 1,
      ),
    ).toBe(true);
  });

  it('6倍役満', () => {
    // 字一色 大四喜 四槓子 四暗刻単騎
    const riichi = new Riichi('5z+11z+22z+33z+44z+5z');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(6);
  });
});

describe('3-6飜役', () => {
  it('清一色', () => {
    const riichi = new Riichi('112233456789m11m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '清一色', { type: 'han', count: 6 });
  });

  it('清一色(食い下がり)', () => {
    const riichi = new Riichi('1234567811m9m+123m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '清一色', { type: 'han', count: 5 });
  });

  it('混一色', () => {
    const riichi = new Riichi('123456m111222z33z');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '混一色', { type: 'han', count: 3 });
  });

  it('二盃口', () => {
    const riichi = new Riichi('112233445566m77m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '二盃口', { type: 'han', count: 3 });
  });

  it('純全帯么九', () => {
    const riichi = new Riichi('123789m123789p99s');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '純全帯么九', { type: 'han', count: 3 });
  });
});

describe('2飜役', () => {
  it('混全帯么九', () => {
    const riichi = new Riichi('123789m111z999p11z');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '混全帯么九', { type: 'han', count: 2 });
  });

  it('対々和', () => {
    const riichi = new Riichi('111222m444p5p5p+333m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '対々和', { type: 'han', count: 2 });
  });

  it('混老頭', () => {
    const riichi = new Riichi('111999m111p11z+999p');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '混老頭', { type: 'han', count: 2 });
  });

  it('三槓子', () => {
    const riichi = new Riichi('456m11p+50m+2222p+3333s');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '三槓子', { type: 'han', count: 2 });
  });

  it('小三元', () => {
    const riichi = new Riichi('555666z77z123456m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '小三元', { type: 'han', count: 2 });
  });

  it('三色同刻', () => {
    const riichi = new Riichi('222m222p222s34577s');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '三色同刻', { type: 'han', count: 2 });
  });

  it('三暗刻', () => {
    const riichi = new Riichi('111222333m456p77p');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '三暗刻', { type: 'han', count: 2 });
  });

  it('七対子', () => {
    const riichi = new Riichi('112233m445566z77m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '七対子', { type: 'han', count: 2 });
  });

  it('ダブル立直', () => {
    const riichi = new Riichi('112233456789m11s+w');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, 'ダブル立直', { type: 'han', count: 2 });
  });

  it('一気通貫', () => {
    const riichi = new Riichi('123456789m111p22p');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '一気通貫', { type: 'han', count: 2 });
  });

  it('三色同順', () => {
    const riichi = new Riichi('123m123p123s34577s');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '三色同順', { type: 'han', count: 2 });
  });
});

describe('1飜役', () => {
  it('断么九', () => {
    const riichi = new Riichi('222333444m567m88m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '断么九', { type: 'han', count: 1 });
  });

  it('平和', () => {
    const riichi = new Riichi('123456789m23444m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '平和', { type: 'han', count: 1 });
  });

  it('一盃口', () => {
    const riichi = new Riichi('112233m456789p55p');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '一盃口', { type: 'han', count: 1 });
  });

  it('門前清自摸和', () => {
    const riichi = new Riichi('112233456789m11s');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '門前清自摸和', { type: 'han', count: 1 });
  });

  it('立直', () => {
    const riichi = new Riichi('112233456789m11s+r');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '立直', { type: 'han', count: 1 });
  });

  it('一発', () => {
    const riichi = new Riichi('112233456789m11s+i');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '一発', { type: 'han', count: 1 });
  });

  it('嶺上開花', () => {
    const riichi = new Riichi('234567p888s99s+22m+k');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '嶺上開花', { type: 'han', count: 1 });
  });

  it('搶槓', () => {
    const riichi = new Riichi('112233456789m1s+1s+k');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '搶槓', { type: 'han', count: 1 });
  });

  it('海底摸月', () => {
    const riichi = new Riichi('112233456789m11s+h');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '海底摸月', { type: 'han', count: 1 });
  });

  it('河底撈魚', () => {
    const riichi = new Riichi('112233456789m1s+h+1s');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '河底撈魚', { type: 'han', count: 1 });
  });

  it('場風東', () => {
    const riichi = new Riichi('111z234567m888p99p+1');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '場風東', { type: 'han', count: 1 });
  });

  it('自風東', () => {
    const riichi = new Riichi('111z234567m888p99p+1');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '自風東', { type: 'han', count: 1 });
  });

  it('役牌白', () => {
    const riichi = new Riichi('555z123456m789p11p');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '役牌白', { type: 'han', count: 1 });
  });

  it('役牌発', () => {
    const riichi = new Riichi('666z123456m789p11p');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '役牌発', { type: 'han', count: 1 });
  });

  it('役牌中', () => {
    const riichi = new Riichi('777z123456m789p11p');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '役牌中', { type: 'han', count: 1 });
  });
});

describe('ドラ (Dora)', () => {
  it('ドラ1枚', () => {
    const riichi = new Riichi('112233456789m11s+d9m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, 'ドラ', { type: 'han', count: 1 });
  });

  it('赤ドラ1枚', () => {
    const riichi = new Riichi('11223340678m9m99s');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '赤ドラ', { type: 'han', count: 1 });
  });

  it('裏ドラ1枚(立直時)', () => {
    const riichi = new Riichi('112233456789m11s+r+d8m+u9m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '立直', { type: 'han', count: 1 });
    expectYaku(result, 'ドラ', { type: 'han', count: 1 });
    expectYaku(result, '裏ドラ', { type: 'han', count: 1 });
  });

  it('裏ドラなし(立直なし)', () => {
    const riichi = new Riichi('112233456789m11s+u9m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expect(hasYaku(result.yaku, '裏ドラ')).toBe(false);
  });

  it('裏ドラのみ(立直時)', () => {
    const riichi = new Riichi('112233456789m11s+r+d9m+u1m');
    const result = riichi.calc();
    assertAgariResult(result);
    expect(result.isAgari).toBe(true);
    expectYaku(result, '立直', { type: 'han', count: 1 });
    expectYaku(result, 'ドラ', { type: 'han', count: 1 });
    expectYaku(result, '裏ドラ', { type: 'han', count: 2 });
  });
});

describe('Type Guard Tests', () => {
  it('should discriminate AgariResult with type field', () => {
    const riichi = new Riichi('112233456789m11s');
    const result = riichi.calc();

    if (result.type === CalcResultType.AGARI) {
      expect(result.isAgari).toBe(true);
      expect(result.error).toBe(false);
      expect(result.han).toBe(4);
      expect(result.ten).toBe(7900);
      expect('hairi' in result).toBe(false);
    } else {
      throw new Error('Expected agari result');
    }
  });

  it('should discriminate NotenResult with type field', () => {
    const riichi = new Riichi('1112345678999m');
    const result = riichi.calc();

    if (result.type === CalcResultType.NOTEN) {
      expect(result.isAgari).toBe(false);
      expect(result.error).toBe(false);
      expect(result.hairi).toBeDefined();
      expect(result.hairi7and13).toBeDefined();
      expect('han' in result).toBe(false);
      expect('fu' in result).toBe(false);
      expect('ten' in result).toBe(false);
    } else {
      throw new Error('Expected noten result');
    }
  });

  it('should discriminate ErrorResult with type field', () => {
    const riichi = new Riichi('123');
    const result = riichi.calc();

    if (result.type === CalcResultType.ERROR) {
      expect(result.isAgari).toBe(false);
      expect(result.error).toBe(true);
      expect('han' in result).toBe(false);
      expect('hairi' in result).toBe(false);
    } else {
      throw new Error('Expected error result');
    }
  });

  it('should work with switch statement', () => {
    const riichi = new Riichi('112233456789m11s');
    const result = riichi.calc();

    switch (result.type) {
      case CalcResultType.AGARI:
        expect(result.ten).toBe(7900);
        break;
      case CalcResultType.NOTEN:
        throw new Error('Should not be noten');
      case CalcResultType.ERROR:
        throw new Error('Should not be error');
    }
  });
});
