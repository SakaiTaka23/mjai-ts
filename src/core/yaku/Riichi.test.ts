import { describe, it, expect } from 'vitest';

import { Riichi } from './Riichi';

describe('Basic Examples', () => {
  it('usage', () => {
    const riichi = new Riichi('112233456789m11s');
    expect(riichi.calc()).toEqual({
      isAgari: true,
      yakuman: 0,
      yaku: { 一気通貫: '2飜', 一盃口: '1飜', 門前清自摸和: '1飜' },
      han: 4,
      fu: 30,
      ten: 7900,
      name: '',
      text: '(南場西家)自摸 30符4飜 7900点(3900,2000)',
      oya: [3900, 3900, 3900],
      ko: [3900, 2000, 2000],
      error: false,
    });
  });
});

describe('役満 (Yakuman)', () => {
  it('国士無双', () => {
    const riichi = new Riichi('11m19p19s1234567z9m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(result.yaku['国士無双']).toBe('役満');
  });

  it('国士無双十三面待ち', () => {
    const riichi = new Riichi('19m19p19s1234567z7z');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(2);
    expect(result.yaku['国士無双十三面待ち']).toBe('ダブル役満');
  });

  it('九蓮宝燈', () => {
    const riichi = new Riichi('1111234678999m5m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(result.yaku['九蓮宝燈']).toBe('役満');
  });

  it('純正九蓮宝燈', () => {
    const riichi = new Riichi('1112345678999m9m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(2);
    expect(result.yaku['純正九蓮宝燈']).toBe('ダブル役満');
  });

  it('四暗刻', () => {
    const riichi = new Riichi('111222333m4455p4p');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(result.yaku['四暗刻']).toBe('役満');
  });

  it('四暗刻単騎待ち', () => {
    const riichi = new Riichi('111222333444m55m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(2);
    expect(result.yaku['四暗刻単騎待ち']).toBe('ダブル役満');
  });

  it('大三元', () => {
    const riichi = new Riichi('555666777z77p+111m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(result.yaku['大三元']).toBe('役満');
  });

  it('小四喜', () => {
    const riichi = new Riichi('111222333z44z+555p');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(result.yaku['小四喜']).toBe('役満');
  });

  it('大四喜', () => {
    const riichi = new Riichi('111222333z11p+444z');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(2);
    expect(result.yaku['大四喜']).toBe('ダブル役満');
  });

  it('字一色', () => {
    const riichi = new Riichi('11122244466z+555z');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(result.yaku['字一色']).toBe('役満');
  });

  it('緑一色', () => {
    const riichi = new Riichi('222333444s88s+666z');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(result.yaku['緑一色']).toBe('役満');
  });

  it('清老頭', () => {
    const riichi = new Riichi('111999m11199s+999p');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(result.yaku['清老頭']).toBe('役満');
  });

  it('四槓子', () => {
    const riichi = new Riichi('5z+1111m+2222p+3333s+4444z+5z');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(result.yaku['四槓子']).toBe('役満');
  });

  it('天和', () => {
    const riichi = new Riichi('112233456789m11s+t1');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(result.yaku['天和']).toBe('役満');
  });

  it('地和', () => {
    const riichi = new Riichi('112233456789m11s+t2');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yakuman).toBe(1);
    expect(result.yaku['地和']).toBe('役満');
  });
});

describe('3-6飜役', () => {
  it('清一色', () => {
    const riichi = new Riichi('112233456789m11m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['清一色']).toBe('6飜');
  });

  it('清一色(食い下がり)', () => {
    const riichi = new Riichi('1234567811m9m+123m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['清一色']).toBe('5飜');
  });

  it('混一色', () => {
    const riichi = new Riichi('123456m111222z33z');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['混一色']).toBe('3飜');
  });

  it('二盃口', () => {
    const riichi = new Riichi('112233445566m77m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['二盃口']).toBe('3飜');
  });

  it('純全帯么九', () => {
    const riichi = new Riichi('123789m123789p99s');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['純全帯么九']).toBe('3飜');
  });
});

describe('2飜役', () => {
  it('混全帯么九', () => {
    const riichi = new Riichi('123789m111z999p11z');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['混全帯么九']).toBe('2飜');
  });

  it('対々和', () => {
    const riichi = new Riichi('111222m444p5p5p+333m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['対々和']).toBe('2飜');
  });

  it('混老頭', () => {
    const riichi = new Riichi('111999m111p11z+999p');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['混老頭']).toBe('2飜');
  });

  it('三槓子', () => {
    const riichi = new Riichi('456m11p+1111m+2222p+3333s');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['三槓子']).toBe('2飜');
  });

  it('小三元', () => {
    const riichi = new Riichi('555666z77z123456m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['小三元']).toBe('2飜');
  });

  it('三色同刻', () => {
    const riichi = new Riichi('222m222p222s34577s');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['三色同刻']).toBe('2飜');
  });

  it('三暗刻', () => {
    const riichi = new Riichi('111222333m456p77p');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['三暗刻']).toBe('2飜');
  });

  it('七対子', () => {
    const riichi = new Riichi('112233m445566z77m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['七対子']).toBe('2飜');
  });

  it('ダブル立直', () => {
    const riichi = new Riichi('112233456789m11s+w');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['ダブル立直']).toBe('2飜');
  });

  it('一気通貫', () => {
    const riichi = new Riichi('123456789m111p22p');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['一気通貫']).toBe('2飜');
  });

  it('三色同順', () => {
    const riichi = new Riichi('123m123p123s34577s');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['三色同順']).toBe('2飜');
  });
});

describe('1飜役', () => {
  it('断么九', () => {
    const riichi = new Riichi('222333444m567m88m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['断么九']).toBe('1飜');
  });

  it('平和', () => {
    const riichi = new Riichi('123456789m23444m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['平和']).toBe('1飜');
  });

  it('一盃口', () => {
    const riichi = new Riichi('112233m456789p55p');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['一盃口']).toBe('1飜');
  });

  it('門前清自摸和', () => {
    const riichi = new Riichi('112233456789m11s');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['門前清自摸和']).toBe('1飜');
  });

  it('立直', () => {
    const riichi = new Riichi('112233456789m11s+r');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['立直']).toBe('1飜');
  });

  it('一発', () => {
    const riichi = new Riichi('112233456789m11s+i');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['一発']).toBe('1飜');
  });

  it('嶺上開花', () => {
    const riichi = new Riichi('234567p888s99s+22m+k');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['嶺上開花']).toBe('1飜');
  });

  it('搶槓', () => {
    const riichi = new Riichi('112233456789m1s+1s+k');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['搶槓']).toBe('1飜');
  });

  it('海底摸月', () => {
    const riichi = new Riichi('112233456789m11s+h');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['海底摸月']).toBe('1飜');
  });

  it('河底撈魚', () => {
    const riichi = new Riichi('112233456789m1s+h+1s');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['河底撈魚']).toBe('1飜');
  });

  it('場風東', () => {
    const riichi = new Riichi('111z234567m888p99p+1');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['場風東']).toBe('1飜');
  });

  it('自風東', () => {
    const riichi = new Riichi('111z234567m888p99p+1');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['自風東']).toBe('1飜');
  });

  it('役牌白', () => {
    const riichi = new Riichi('555z123456m789p11p');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['役牌白']).toBe('1飜');
  });

  it('役牌発', () => {
    const riichi = new Riichi('666z123456m789p11p');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['役牌発']).toBe('1飜');
  });

  it('役牌中', () => {
    const riichi = new Riichi('777z123456m789p11p');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['役牌中']).toBe('1飜');
  });
});

describe('ドラ (Dora)', () => {
  it('ドラ1枚', () => {
    const riichi = new Riichi('112233456789m11s+d9m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['ドラ']).toBe('1飜');
  });

  it('赤ドラ1枚', () => {
    const riichi = new Riichi('11223340678m9m99s');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['赤ドラ']).toBe('1飜');
  });

  it('裏ドラ1枚(立直時)', () => {
    const riichi = new Riichi('112233456789m11s+r+d8m+u9m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['立直']).toBe('1飜');
    expect(result.yaku['ドラ']).toBe('1飜');
    expect(result.yaku['裏ドラ']).toBe('1飜');
  });

  it('裏ドラなし(立直なし)', () => {
    const riichi = new Riichi('112233456789m11s+u9m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['裏ドラ']).toBeUndefined();
  });

  it('裏ドラのみ(立直時)', () => {
    const riichi = new Riichi('112233456789m11s+r+d9m+u1m');
    const result = riichi.calc();
    expect(result.isAgari).toBe(true);
    expect(result.yaku['立直']).toBe('1飜');
    expect(result.yaku['ドラ']).toBe('1飜');
    expect(result.yaku['裏ドラ']).toBe('2飜');
  });
});
