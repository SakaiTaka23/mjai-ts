import { describe, expect, it } from 'vitest';
import { addTehai, removeTehai } from '../Editor';
import { Tile } from '@mjai/types';

describe('Editor', () => {
    describe('addTehai', () => {
        it('should add a tile and sort the hand', () => {
            const tehai: Tile[] = ['1m', '2m', '3m'];
            const newTile: Tile = '2m';
            const expected: Tile[] = ['1m', '2m', '2m', '3m'];
            expect(addTehai(newTile, tehai)).toEqual(expected);
        });
    });

    describe('removeTehai', () => {
        it('should remove first occurrence of specified tile', () => {
            const tehai: Tile[] = ['1m', '1m', '2m', '3m'];
            const tileToRemove: Tile = '1m';
            const expected: Tile[] = ['1m', '2m', '3m'];
            expect(removeTehai(tileToRemove, tehai)).toEqual(expected);
        });

        it('should handle removing red dora', () => {
            const tehai: Tile[] = ['1m', '2m', '3m', '5mr'];
            const tileToRemove: Tile = '5mr';
            const expected: Tile[] = ['1m', '2m', '3m'];
            expect(removeTehai(tileToRemove, tehai)).toEqual(expected);
        });

        // Currently not expecting unexpected argument to be passed
        it('should return unchanged array if tile not found', () => {
            const tehai: Tile[] = ['1m', '2m', '3m'];
            const tileToRemove: Tile = '4m';
            const expected: Tile[] = ['1m', '2m', '3m'];
            expect(removeTehai(tileToRemove, tehai)).toEqual(expected);
        });
    });
});
