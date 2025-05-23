import { z } from 'zod';

export const TileInput = z.enum([
  // Manzu
  '1m',
  '2m',
  '3m',
  '4m',
  '5m',
  '6m',
  '7m',
  '8m',
  '9m',
  '5mr',

  // Pinzu
  '1p',
  '2p',
  '3p',
  '4p',
  '5p',
  '6p',
  '7p',
  '8p',
  '9p',
  '5pr',

  // Souzu
  '1s',
  '2s',
  '3s',
  '4s',
  '5s',
  '6s',
  '7s',
  '8s',
  '9s',
  '5sr',

  // Wind
  'E',
  'S',
  'W',
  'N',

  // Dragon
  'P',
  'F',
  'C',

  // Special
  '?',
]);

export const PlayerIDInput = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);
