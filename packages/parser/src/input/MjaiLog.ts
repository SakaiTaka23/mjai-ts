import { z } from 'zod';

import { PlayerIDInput, TileInput } from './common';

export const AnkanSchema = z.object({
  type: z.literal('ankan'),
  actor: PlayerIDInput,
  consumed: z.tuple([TileInput, TileInput, TileInput, TileInput]),
});

export const ChiSchema = z.object({
  type: z.literal('chi'),
  actor: PlayerIDInput,
  target: PlayerIDInput,
  pai: TileInput,
  consumed: z.tuple([TileInput, TileInput]),
});

export const DahaiSchema = z.object({
  type: z.literal('dahai'),
  actor: PlayerIDInput,
  pai: TileInput,
  tsumogiri: z.boolean(),
});

export const DaiminkanSchema = z.object({
  type: z.literal('daiminkan'),
  actor: PlayerIDInput,
  target: PlayerIDInput,
  pai: TileInput,
  consumed: z.tuple([TileInput, TileInput, TileInput]),
});

export const DoraSchema = z.object({
  type: z.literal('dora'),
  dora_marker: TileInput,
});

export const EndGameSchema = z.object({
  type: z.literal('end_game'),
});

export const EndKyokuSchema = z.object({
  type: z.literal('end_kyoku'),
});

export const HoraSchema = z.object({
  type: z.literal('hora'),
  actor: PlayerIDInput,
  target: PlayerIDInput,
  deltas: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  ura_markers: z.array(TileInput).min(0).max(4),
});

export const KakanSchema = z.object({
  type: z.literal('kakan'),
  actor: PlayerIDInput,
  pai: TileInput,
  consumed: z.tuple([TileInput, TileInput, TileInput]),
});

export const PonSchema = z.object({
  type: z.literal('pon'),
  actor: PlayerIDInput,
  target: PlayerIDInput,
  pai: TileInput,
  consumed: z.tuple([TileInput, TileInput]),
});

export const ReachSchema = z.object({
  type: z.literal('reach'),
  actor: PlayerIDInput,
});

export const ReachAcceptedSchema = z.object({
  type: z.literal('reach_accepted'),
  actor: PlayerIDInput,
});

export const RyukyokuSchema = z.object({
  type: z.literal('ryukyoku'),
  deltas: z.tuple([z.number(), z.number(), z.number(), z.number()]),
});

export const StartGameSchema = z.object({
  type: z.literal('start_game'),
  names: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  kyoku_first: PlayerIDInput,
  aka_flag: z.boolean(),
});

export const StartKyokuSchema = z.object({
  type: z.literal('start_kyoku'),
  bakaze: z.enum(['E', 'S', 'W']),
  dora_marker: TileInput,
  kyoku: z.number().min(0).max(11),
  honba: z.number().min(0),
  kyotaku: z.number().min(0),
  oya: PlayerIDInput,
  scores: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  tehais: z.array(z.array(TileInput).length(13)).length(4),
});

export const TsumoSchema = z.object({
  type: z.literal('tsumo'),
  actor: PlayerIDInput,
  pai: TileInput,
});

export const MjaiLogSchema = z
  .discriminatedUnion('type', [
    AnkanSchema,
    ChiSchema,
    DahaiSchema,
    DaiminkanSchema,
    DoraSchema,
    EndGameSchema,
    EndKyokuSchema,
    HoraSchema,
    KakanSchema,
    PonSchema,
    ReachSchema,
    ReachAcceptedSchema,
    RyukyokuSchema,
    StartGameSchema,
    StartKyokuSchema,
    TsumoSchema,
  ])
  .transform((data) => {
    switch (data.type) {
      case 'dora':
        return {
          type: data.type,
          doraMarkers: data.dora_marker,
        };
      case 'hora':
        return {
          ...data,
          uraMarkers: data.ura_markers,
        };
      case 'start_kyoku': {
        const {
          type,
          bakaze,
          kyoku,
          honba,
          kyotaku,
          oya,
          scores,
          tehais,
          dora_marker,
        } = data;
        return {
          type,
          bakaze,
          kyoku,
          honba,
          kyotaku,
          oya,
          scores,
          tehais,
          doraMarker: dora_marker,
        };
      }
      default:
        return data;
    }
  });

export const MjaiLogInputSchema = z.array(MjaiLogSchema);

export type MjaiLogInput = z.infer<typeof MjaiLogInputSchema>;
