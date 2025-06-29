import z from 'zod/v4';

const ManzuTiles = z.union([
  z.literal('1m'),
  z.literal('2m'),
  z.literal('3m'),
  z.literal('4m'),
  z.literal('5m'),
  z.literal('6m'),
  z.literal('7m'),
  z.literal('8m'),
  z.literal('9m'),
  z.literal('5mr'),
]);

const PinzuTiles = z.union([
  z.literal('1p'),
  z.literal('2p'),
  z.literal('3p'),
  z.literal('4p'),
  z.literal('5p'),
  z.literal('6p'),
  z.literal('7p'),
  z.literal('8p'),
  z.literal('9p'),
  z.literal('5pr'),
]);

const SouzuTiles = z.union([
  z.literal('1s'),
  z.literal('2s'),
  z.literal('3s'),
  z.literal('4s'),
  z.literal('5s'),
  z.literal('6s'),
  z.literal('7s'),
  z.literal('8s'),
  z.literal('9s'),
  z.literal('5sr'),
]);

const SpecialTiles = z.union([
  z.literal('E'),
  z.literal('S'),
  z.literal('W'),
  z.literal('N'),
  z.literal('P'),
  z.literal('F'),
  z.literal('C'),
  z.literal('?'),
]);

export const TileInput = z.union([
  ManzuTiles,
  PinzuTiles,
  SouzuTiles,
  SpecialTiles,
]);

export const PlayerIDInput = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);
