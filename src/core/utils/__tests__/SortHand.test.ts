import { describe, expect, it } from 'vitest';

import { Tile } from '@types';

import { sortHand } from '../SortHand';

describe('sortHand', () => {
  it('should sort manzu tiles correctly', () => {
    const input: Tile[] = [
      '9m',
      '1m',
      '5m',
      '3m',
      '2m',
      '4m',
      '6m',
      '7m',
      '8m',
      '5mr',
    ];
    const expected: Tile[] = [
      '1m',
      '2m',
      '3m',
      '4m',
      '5m',
      '5mr',
      '6m',
      '7m',
      '8m',
      '9m',
    ];
    expect(sortHand(input)).toEqual(expected);
  });

  it('should sort pinzu tiles correctly', () => {
    const input: Tile[] = [
      '9p',
      '1p',
      '5p',
      '3p',
      '2p',
      '4p',
      '6p',
      '7p',
      '8p',
      '5pr',
    ];
    const expected: Tile[] = [
      '1p',
      '2p',
      '3p',
      '4p',
      '5p',
      '5pr',
      '6p',
      '7p',
      '8p',
      '9p',
    ];
    expect(sortHand(input)).toEqual(expected);
  });

  it('should sort souzu tiles correctly', () => {
    const input: Tile[] = [
      '9s',
      '1s',
      '5s',
      '3s',
      '2s',
      '4s',
      '6s',
      '7s',
      '8s',
      '5sr',
    ];
    const expected: Tile[] = [
      '1s',
      '2s',
      '3s',
      '4s',
      '5s',
      '5sr',
      '6s',
      '7s',
      '8s',
      '9s',
    ];
    expect(sortHand(input)).toEqual(expected);
  });

  it('should sort all red dora tiles correctly', () => {
    const input: Tile[] = ['5mr', '5pr', '5sr'];
    const expected: Tile[] = ['5mr', '5pr', '5sr'];
    expect(sortHand(input)).toEqual(expected);
  });

  it('should sort honor tiles correctly', () => {
    const input: Tile[] = ['N', 'P', 'F', 'E', 'C', 'W', 'S'];
    const expected: Tile[] = ['E', 'S', 'W', 'N', 'P', 'F', 'C'];
    expect(sortHand(input)).toEqual(expected);
  });

  it('should sort mixed tiles correctly', () => {
    const input: Tile[] = ['9m', '1p', '5s', 'N', '1m', 'P', '5pr', '5sr'];
    const expected: Tile[] = ['1m', '9m', '1p', '5pr', '5s', '5sr', 'N', 'P'];
    expect(sortHand(input)).toEqual(expected);
  });

  it('should handle empty array', () => {
    const input: Tile[] = [];
    expect(sortHand(input)).toEqual([]);
  });
});
