import { describe, expect, it } from 'vitest';

import { Riichi } from './Riichi';
import { ConvertFull } from './TileConverter';

describe('Basic Examples', () => {
  it('usage', () => {
    const fullString = ConvertFull(
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
    expect(fullString).toBe('1m1m2m2m3m3m4m5m6m7m8m9m1s1s+d5p+12');

    const riichi = new Riichi(fullString);
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
