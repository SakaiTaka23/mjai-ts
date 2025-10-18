import { describe, expect, it } from 'vitest';

import {
  findAllAgariPatterns,
  check,
  check7,
  check13,
  checkAll,
} from './Agari';
import { HaiArr } from './YakuTypes';

const test_cases: [HaiArr, HaiArr, HaiArr, HaiArr] = [
  [
    [2, 2, 0, 2, 0, 0, 2, 2, 2],
    [0, 0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 1, 1, 1, 1, 1],
  ],
  [
    [0, 0, 0, 0, 0, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1],
    [0, 0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 0],
  ],
  [
    [2, 2, 2, 2, 0, 0, 2, 2, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ],
];

describe('Agari', () => {
  it('check', () => {
    expect(check(test_cases[0])).toBe(false);
    expect(check(test_cases[1])).toBe(false);
    expect(check(test_cases[2])).toBe(true);
    expect(check(test_cases[3])).toBe(true);
  });

  it('check7', () => {
    expect(check7(test_cases[0])).toBe(true);
    expect(check7(test_cases[1])).toBe(false);
    expect(check7(test_cases[2])).toBe(false);
    expect(check7(test_cases[3])).toBe(true);
  });

  it('check13', () => {
    expect(check13(test_cases[0])).toBe(false);
    expect(check13(test_cases[1])).toBe(true);
    expect(check13(test_cases[0])).toBe(false);
    expect(check13(test_cases[1])).toBe(true);
  });

  it('checkAll', () => {
    expect(checkAll(test_cases[0])).toBe(true);
    expect(checkAll(test_cases[1])).toBe(true);
    expect(checkAll(test_cases[0])).toBe(true);
    expect(checkAll(test_cases[1])).toBe(true);
  });

  it('findAllAgariPatterns', () => {
    expect(findAllAgariPatterns(test_cases[0])).toEqual([]);
    expect(findAllAgariPatterns(test_cases[1])).toEqual([]);
    expect(findAllAgariPatterns(test_cases[2])).toEqual([
      [
        '3s',
        ['6m', '7m', '8m'],
        ['6m', '7m', '8m'],
        ['6z'],
        ['7p', '8p', '9p'],
      ],
    ]);
    expect(findAllAgariPatterns(test_cases[3])).toEqual([
      [
        '1m',
        ['2m', '3m', '4m'],
        ['2m', '3m', '4m'],
        ['7m', '8m', '9m'],
        ['7m', '8m', '9m'],
      ],
      [
        ['1m', '2m', '3m'],
        ['1m', '2m', '3m'],
        '4m',
        ['7m', '8m', '9m'],
        ['7m', '8m', '9m'],
      ],
    ]);
  });

  it('findAllAgariPatterns - additional patterns', () => {
    expect(
      findAllAgariPatterns([
        [0, 0, 0, 0, 0, 2, 2, 2, 2],
        [0, 0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 3, 0],
      ]),
    ).toEqual([
      [
        '6m',
        ['6z'],
        ['7m', '8m', '9m'],
        ['7m', '8m', '9m'],
        ['7p', '8p', '9p'],
      ],
      [
        ['6m', '7m', '8m'],
        ['6m', '7m', '8m'],
        ['6z'],
        ['7p', '8p', '9p'],
        '9m',
      ],
    ]);

    expect(
      findAllAgariPatterns([
        [4, 4, 4, 2, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ]),
    ).toEqual([
      [
        '1m',
        ['1m', '2m', '3m'],
        ['1m', '2m', '3m'],
        ['2m', '3m', '4m'],
        ['2m', '3m', '4m'],
      ],
      [['1m'], ['1m', '2m', '3m'], ['2m'], ['3m'], '4m'],
      [
        ['1m', '2m', '3m'],
        ['1m', '2m', '3m'],
        ['1m', '2m', '3m'],
        ['1m', '2m', '3m'],
        '4m',
      ],
    ]);

    expect(
      findAllAgariPatterns([
        [3, 1, 1, 3, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ]),
    ).toEqual([
      ['1m', ['1m', '2m', '3m'], ['1p'], ['1s'], ['4m']],
      [['1m'], ['1p'], ['1s'], ['2m', '3m', '4m'], '4m'],
    ]);

    expect(
      findAllAgariPatterns([
        [0, 2, 2, 2, 2, 2, 2, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ]),
    ).toEqual([
      [
        '2m',
        ['3m', '4m', '5m'],
        ['3m', '4m', '5m'],
        ['6m', '7m', '8m'],
        ['6m', '7m', '8m'],
      ],
      [
        ['2m', '3m', '4m'],
        ['2m', '3m', '4m'],
        '5m',
        ['6m', '7m', '8m'],
        ['6m', '7m', '8m'],
      ],
      [
        ['2m', '3m', '4m'],
        ['2m', '3m', '4m'],
        ['5m', '6m', '7m'],
        ['5m', '6m', '7m'],
        '8m',
      ],
    ]);
  });

  // 追加テストケース
  it('should return [] for empty hand', () => {
    expect(
      findAllAgariPatterns([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ]),
    ).toEqual([]);
  });

  it('should handle 7 pairs (chiitoitsu)', () => {
    expect(
      check7([
        [2, 2, 0, 2, 0, 0, 2, 2, 2],
        [0, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ]),
    ).toBe(true);
  });

  it('should handle kokushi musou (thirteen orphans)', () => {
    expect(
      check13([
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 2, 1, 1, 1, 1, 1],
      ]),
    ).toBe(true);
  });

  it('should return [] for non-winning hand', () => {
    expect(
      findAllAgariPatterns([
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
      ]),
    ).toEqual([]);
  });
});
