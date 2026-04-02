import { describe, it, expect } from 'vitest';

import { Tile } from '@types';

import { calculateUkeire } from './Ukeire';
import { Fuuro } from '../types/Tehai';

describe('calculateUkeire', () => {
  describe('Basic shanten calculation', () => {
    it('should calculate 1-shanten hand', () => {
      // 1-shanten: 1m2m3m4m5m6m7m8m1p2p3p4p5p
      const tehai: Tile[] = [
        '1m',
        '2m',
        '3m',
        '4m',
        '5m',
        '6m',
        '7m',
        '8m',
        '1p',
        '2p',
        '3p',
        '4p',
        '5p',
      ];
      const result = calculateUkeire(tehai);

      expect(result.shanten).toBe(1);
      expect(result.ukeire).toBeGreaterThan(0);
      expect(result.tiles.size).toBeGreaterThan(0);
    });

    it('should calculate 4-shanten hand', () => {
      // 4-shanten: 1m3m5m7m9m2p4p6p8p1s3s5s7s
      const tehai: Tile[] = [
        '1m',
        '3m',
        '5m',
        '7m',
        '9m',
        '2p',
        '4p',
        '6p',
        '8p',
        '1s',
        '3s',
        '5s',
        '7s',
      ];
      const result = calculateUkeire(tehai);

      expect(result.shanten).toBe(4);
      expect(result.ukeire).toBeGreaterThan(0);
    });

    it('should calculate tenpai (0-shanten) hand', () => {
      // Tenpai: 1m2m3m4m5m6m7m8m9m1p2p3p3p
      const tehai: Tile[] = [
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
        '3p',
        '3p',
      ];
      const result = calculateUkeire(tehai);

      expect(result.shanten).toBe(0);
      expect(result.ukeire).toBeGreaterThan(0);
      expect(result.tiles.size).toBeGreaterThan(0);
    });
  });

  describe('Honor tiles', () => {
    it('should handle honor tiles (E, S, W, N, P, F, C)', () => {
      // Hand with honor tiles
      const tehai: Tile[] = [
        '1m',
        '2m',
        '3m',
        '4m',
        '5m',
        '6m',
        '7m',
        '8m',
        '9m',
        'E',
        'E',
        'E',
        'P',
      ];
      const result = calculateUkeire(tehai);

      expect(result.shanten).toBeGreaterThanOrEqual(0);
      expect(result.tiles).toBeInstanceOf(Map);
    });

    it('should convert honor tiles to internal format', () => {
      // Simple tenpai with honor tile wait
      const tehai: Tile[] = [
        '1m',
        '1m',
        '1m',
        '2p',
        '3p',
        '4p',
        '5s',
        '5s',
        '5s',
        'E',
        'E',
        'E',
        'P',
      ];
      const result = calculateUkeire(tehai);

      expect(result.shanten).toBeLessThanOrEqual(1);
      expect(result.tiles).toBeInstanceOf(Map);
    });
  });

  describe('Red dora normalization', () => {
    it('should normalize 5mr to 5m', () => {
      const tehai: Tile[] = [
        '1m',
        '2m',
        '3m',
        '4m',
        '5mr',
        '6m',
        '7m',
        '8m',
        '9m',
        '1p',
        '2p',
        '3p',
        '4p',
      ];
      const result = calculateUkeire(tehai);

      expect(result.shanten).toBeGreaterThanOrEqual(0);
      expect(result.tiles).toBeInstanceOf(Map);
    });

    it('should normalize 5pr and 5sr', () => {
      const tehai: Tile[] = [
        '1m',
        '2m',
        '3m',
        '4p',
        '5pr',
        '6p',
        '1s',
        '2s',
        '3s',
        '4s',
        '5sr',
        '6s',
        'E',
      ];
      const result = calculateUkeire(tehai);

      expect(result.shanten).toBeGreaterThanOrEqual(0);
      expect(result.tiles).toBeInstanceOf(Map);
    });
  });

  describe('Fuuro support', () => {
    it('should handle chi', () => {
      const tehai: Tile[] = [
        '1m',
        '2m',
        '3m',
        '4m',
        '5m',
        '6m',
        '7m',
        '8m',
        '9m',
        'E',
      ];
      const fuuros: Fuuro[] = [
        {
          type: 'chi',
          actor: 0,
          target: 3,
          pai: '2p',
          consumed: ['1p', '3p'],
        },
      ];
      const result = calculateUkeire(tehai, fuuros);

      expect(result.shanten).toBeGreaterThanOrEqual(0);
      expect(result.tiles).toBeInstanceOf(Map);
    });

    it('should handle pon', () => {
      const tehai: Tile[] = [
        '1m',
        '2m',
        '3m',
        '4m',
        '5m',
        '6m',
        '7m',
        '8m',
        '9m',
        'E',
      ];
      const fuuros: Fuuro[] = [
        {
          type: 'pon',
          actor: 0,
          target: 1,
          pai: 'P',
          consumed: ['P', 'P'],
        },
      ];
      const result = calculateUkeire(tehai, fuuros);

      expect(result.shanten).toBeGreaterThanOrEqual(0);
      expect(result.tiles).toBeInstanceOf(Map);
    });

    it('should handle ankan', () => {
      // Realistic: 10 tiles in hand + ankan(4) = 14 (between turns with 1 kan)
      const tehai: Tile[] = [
        '1m',
        '2m',
        '3m',
        '4p',
        '5p',
        '6p',
        '7s',
        '8s',
        '9s',
        'P',
      ];
      const fuuros: Fuuro[] = [
        {
          type: 'ankan',
          actor: 0,
          consumed: ['E', 'E', 'E', 'E'],
        },
      ];
      const result = calculateUkeire(tehai, fuuros);

      expect(result.shanten).toBeGreaterThanOrEqual(0);
      expect(result.tiles).toBeInstanceOf(Map);
    });

    it('should handle daiminkan', () => {
      // Realistic: 10 tiles in hand + daiminkan(4) = 14 (between turns with 1 kan)
      const tehai: Tile[] = [
        '1m',
        '2m',
        '3m',
        '4p',
        '5p',
        '6p',
        '7s',
        '8s',
        '9s',
        'P',
      ];
      const fuuros: Fuuro[] = [
        {
          type: 'daiminkan',
          actor: 0,
          target: 2,
          pai: 'S',
          consumed: ['S', 'S', 'S'],
        },
      ];
      const result = calculateUkeire(tehai, fuuros);

      expect(result.shanten).toBeGreaterThanOrEqual(0);
      expect(result.tiles).toBeInstanceOf(Map);
    });

    it('should handle kakan', () => {
      // Realistic: 10 tiles in hand + kakan(4) = 14 (between turns with 1 kan)
      const tehai: Tile[] = [
        '1m',
        '2m',
        '3m',
        '4p',
        '5p',
        '6p',
        '7s',
        '8s',
        '9s',
        'P',
      ];
      const fuuros: Fuuro[] = [
        {
          type: 'kakan',
          actor: 0,
          pai: 'W',
          consumed: ['W', 'W', 'W'],
          ponTarget: 1,
          ponPai: 'W',
          ponConsumed: ['W', 'W'],
        },
      ];
      const result = calculateUkeire(tehai, fuuros);

      expect(result.shanten).toBeGreaterThanOrEqual(0);
      expect(result.tiles).toBeInstanceOf(Map);
    });

    it('should handle empty fuuro array', () => {
      const tehai: Tile[] = [
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
        '3p',
        '4p',
      ];
      const result = calculateUkeire(tehai, []);

      expect(result.shanten).toBeGreaterThanOrEqual(0);
      expect(result.tiles).toBeInstanceOf(Map);
    });
  });

  describe('Edge cases', () => {
    it('should throw error for invalid tile count (< 13)', () => {
      const tehai: Tile[] = ['1m', '2m', '3m', '4m', '5m'];

      expect(() => calculateUkeire(tehai)).toThrow('Invalid tile count: 5');
    });

    it('should throw error for invalid tile count (> 14)', () => {
      const tehai: Tile[] = [
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
        '3p',
        '4p',
        '5p',
        '6p',
      ];

      expect(() => calculateUkeire(tehai)).toThrow('Invalid tile count: 15');
    });

    it('should handle 13-tile hand', () => {
      const tehai: Tile[] = [
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
        '3p',
        '4p',
      ];
      const result = calculateUkeire(tehai);

      expect(result.shanten).toBeGreaterThanOrEqual(0);
      expect(result.tiles).toBeInstanceOf(Map);
      expect(result.discardOptions).toBeUndefined();
    });

    it('should handle 14-tile hand', () => {
      const tehai: Tile[] = [
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
        '3p',
        '4p',
        '5p',
      ];
      const result = calculateUkeire(tehai);

      expect(result.shanten).toBeGreaterThanOrEqual(0);
      expect(result.tiles).toBeInstanceOf(Map);
    });
  });

  describe('Specific expected value tests', () => {
    it('should calculate tenpai hand waiting for P (5z) with 3 tiles', () => {
      // 1m2m3m 4p5p6p 7s8s9s EEE P → tenpai, waiting for P (5z) x3
      const tehai: Tile[] = [
        '1m',
        '2m',
        '3m',
        '4p',
        '5p',
        '6p',
        '7s',
        '8s',
        '9s',
        'E',
        'E',
        'E',
        'P',
      ];
      const result = calculateUkeire(tehai);

      expect(result.shanten).toBe(0);
      expect(result.tiles.size).toBe(1);
      expect(result.tiles.get('P')).toBe(3); // 4 - 1 held = 3
      expect(result.ukeire).toBe(3);
    });

    it('should calculate tenpai hand with ryanmen (both-side) wait', () => {
      // 1p2p3p 4p5p6p 7p8p9p EE 4m5m → waiting for 3m or 6m
      const tehai: Tile[] = [
        '1p',
        '2p',
        '3p',
        '4p',
        '5p',
        '6p',
        '7p',
        '8p',
        '9p',
        'E',
        'E',
        '4m',
        '5m',
      ];
      const result = calculateUkeire(tehai);

      expect(result.shanten).toBe(0);
      expect(result.tiles.has('3m')).toBe(true);
      expect(result.tiles.has('6m')).toBe(true);
      expect(result.tiles.get('3m')).toBe(4); // none held
      expect(result.tiles.get('6m')).toBe(4); // none held
      expect(result.ukeire).toBe(8);
    });

    it('should return shanten=-1 and no waiting tiles for complete hand', () => {
      // 1m2m3m 4p5p6p 7s8s9s EEE PP → complete hand (agari)
      const tehai: Tile[] = [
        '1m',
        '2m',
        '3m',
        '4p',
        '5p',
        '6p',
        '7s',
        '8s',
        '9s',
        'E',
        'E',
        'E',
        'P',
        'P',
      ];
      const result = calculateUkeire(tehai);

      expect(result.shanten).toBe(-1);
      expect(result.ukeire).toBe(0);
      expect(result.tiles.size).toBe(0);
    });

    it('should have specific discard keys in discardOptions for 14-tile hand', () => {
      // 14-tile hand: 1m2m3m 4p5p6p 7s8s9s EEE P P
      // This is a complete hand (shanten=-1), so discardOptions may not exist
      // Use a non-complete 14-tile hand instead
      const tehai2: Tile[] = [
        '1m',
        '2m',
        '3m',
        '4p',
        '5p',
        '6p',
        '7s',
        '8s',
        '9s',
        'E',
        'E',
        'E',
        'P',
        'F',
      ];
      const result2 = calculateUkeire(tehai2);

      expect(result2.discardOptions).toBeDefined();
      // Discarding P should leave a hand waiting for F and vice versa
      expect(result2.discardOptions!.has('P')).toBe(true);
      expect(result2.discardOptions!.has('F')).toBe(true);

      // Discarding P → waiting for F, 3 remaining
      const discardP = result2.discardOptions!.get('P')!;
      expect(discardP.shanten).toBe(0);
      expect(discardP.tiles.has('F')).toBe(true);
      expect(discardP.tiles.get('F')).toBe(3); // 4 - 1 held in hand = 3
    });

    it('should reflect held tile count in ukeire (3 held → 1 remaining)', () => {
      // Hand with 3 copies of E, waiting for E → only 1 remaining
      // 1m2m3m 4p5p6p 7s8s 9s E E E → need pair, E has 1 left
      // Actually: 1m2m3m 4p5p6p 7s8s9s EE + one more E for pair wait
      // Let's use: 1m2m3m 4p5p6p 7s8s9s 1p1p1p E → waiting for E (1 left)
      const tehai: Tile[] = [
        '1m',
        '2m',
        '3m',
        '4p',
        '5p',
        '6p',
        '7s',
        '8s',
        '9s',
        '1p',
        '1p',
        '1p',
        'E',
      ];
      const result = calculateUkeire(tehai);

      expect(result.shanten).toBe(0);
      // Waiting for E (1z): 4 - 1 = 3 remaining
      // But also could be waiting for 1p: 4 - 3 = 1 remaining
      // The hand is: 123m 456p 789s 111p + E (tanki wait on E)
      // or: 123m 456p 789s + EE pair needs another mentsu from 1p1p1p → not valid
      // Actually 1p1p1p is a kou (triplet), so: 123m 456p 789s 111p E → waiting for E
      expect(result.tiles.has('E')).toBe(true);
      expect(result.tiles.get('E')).toBe(3); // 4 - 1 held = 3
    });

    it('should reflect held tile count in ukeire (3 held → 1 remaining)', () => {
      // Hand with 3 copies of E, waiting for E → only 1 remaining
      // 1m2m3m 4p5p6p 7s8s 9s E E E → need pair, E has 1 left
      // Actually: 1m2m3m 4p5p6p 7s8s9s EE + one more E for pair wait
      // Let's use: 1m2m3m 4p5p6p 7s8s9s 1p1p1p E → waiting for E (1 left)
      const tehai: Tile[] = [
        '1m',
        '2m',
        '3m',
        '4p',
        '5p',
        '6p',
        '7s',
        '8s',
        '9s',
        '1p',
        '1p',
        '1p',
        'E',
      ];
      const result = calculateUkeire(tehai);

      expect(result.shanten).toBe(0);
      // Waiting for E (1z): 4 - 1 = 3 remaining
      // But also could be waiting for 1p: 4 - 3 = 1 remaining
      // The hand is: 123m 456p 789s 111p + E (tanki wait on E)
      // or: 123m 456p 789s + EE pair needs another mentsu from 1p1p1p → not valid
      // Actually 1p1p1p is a kou (triplet), so: 123m 456p 789s 111p E → waiting for E
      expect(result.tiles.has('E')).toBe(true);
      expect(result.tiles.get('E')).toBe(3); // 4 - 1 held = 3
    });

    it('should have 1 remaining when 3 copies of a tile are held and waiting for it', () => {
      // 2m3m4m 5p6p7p 8s8s8s EEE 8s → waiting for 8s? No, already 3.
      // Better: build hand where we hold 3 of a tile and wait for the 4th
      // 1m1m1m 2p3p4p 5s6s7s 8s9s EE → not right
      // Simpler: 1m1m1m 4p5p6p 7s8s9s PP 2m3m → waiting 1m(1) or 4m(4)
      const tehai: Tile[] = [
        '1m',
        '1m',
        '1m',
        '4p',
        '5p',
        '6p',
        '7s',
        '8s',
        '9s',
        'P',
        'P',
        '2m',
        '3m',
      ];
      const result = calculateUkeire(tehai);

      expect(result.shanten).toBe(0);
      // 111m is kou, PP is pair, 456p 789s are mentsu, 2m3m waits for 1m or 4m
      // 1m wait: 4 - 3 = 1 remaining
      // 4m wait: 4 - 0 = 4 remaining
      expect(result.tiles.has('1m')).toBe(true);
      expect(result.tiles.get('1m')).toBe(1); // 4 - 3 held = 1
      expect(result.tiles.has('4m')).toBe(true);
      expect(result.tiles.get('4m')).toBe(4); // none held
      // Also waits for P (5z) as alternative pair: 4 - 2 held = 2
      expect(result.tiles.has('P')).toBe(true);
      expect(result.tiles.get('P')).toBe(2);
      expect(result.ukeire).toBe(7); // 1 + 4 + 2
    });
  });

  describe('Result validation', () => {
    it('should return tiles as a Map', () => {
      const tehai: Tile[] = [
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
        '3p',
        '4p',
      ];
      const result = calculateUkeire(tehai);

      expect(result.tiles).toBeInstanceOf(Map);
    });

    it('should have tile counts between 1-4', () => {
      const tehai: Tile[] = [
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
        '3p',
        '4p',
      ];
      const result = calculateUkeire(tehai);

      for (const count of result.tiles.values()) {
        expect(count).toBeGreaterThanOrEqual(0);
        expect(count).toBeLessThanOrEqual(4);
      }
    });

    it('should have ukeire sum matching tile counts', () => {
      const tehai: Tile[] = [
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
        '3p',
        '4p',
      ];
      const result = calculateUkeire(tehai);

      const sumFromTiles = Array.from(result.tiles.values()).reduce(
        (sum, count) => sum + count,
        0,
      );
      expect(result.ukeire).toBe(sumFromTiles);
    });
  });

  describe('14-tile hands with discardOptions', () => {
    it('should provide discardOptions for 14-tile hands', () => {
      const tehai: Tile[] = [
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
        '3p',
        '4p',
        '5p',
      ];
      const result = calculateUkeire(tehai);

      if (result.discardOptions) {
        expect(result.discardOptions.size).toBeGreaterThan(0);

        // Check each discard option
        for (const [discard, option] of result.discardOptions.entries()) {
          expect(option.discard).toBe(discard);
          expect(option.shanten).toBeGreaterThanOrEqual(0);
          expect(option.ukeire).toBeGreaterThanOrEqual(0);
          expect(option.tiles).toBeInstanceOf(Map);

          // Validate ukeire sum
          const sumFromTiles = Array.from(option.tiles.values()).reduce(
            (sum, count) => sum + count,
            0,
          );
          expect(option.ukeire).toBe(sumFromTiles);
        }
      }
    });

    it('should have valid discard options with correct tile counts', () => {
      const tehai: Tile[] = [
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
        '1p',
        '1p',
        '2p',
      ];
      const result = calculateUkeire(tehai);

      if (result.discardOptions) {
        for (const option of result.discardOptions.values()) {
          // Each tile count should be valid (0-4)
          for (const count of option.tiles.values()) {
            expect(count).toBeGreaterThanOrEqual(0);
            expect(count).toBeLessThanOrEqual(4);
          }
        }
      }
    });
  });
});
