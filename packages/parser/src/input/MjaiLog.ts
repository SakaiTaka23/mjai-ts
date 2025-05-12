import { z } from 'zod';

import { PlayerIDInput, TileInput } from './common';

const MjaiLogSchema = z
  .discriminatedUnion('type', [
    z.object({
      type: z.literal('ankan'),
      actor: PlayerIDInput,
      consumed: z.array(TileInput).length(4),
    }),
    z.object({
      type: z.literal('chi'),
      actor: PlayerIDInput,
      target: PlayerIDInput,
      pai: TileInput,
      consumed: z.array(TileInput).length(2),
    }),
    z.object({
      type: z.literal('dahai'),
      actor: PlayerIDInput,
      pai: TileInput,
      tsumogiri: z.boolean(),
    }),
    z.object({
      type: z.literal('daiminkan'),
      actor: PlayerIDInput,
      target: PlayerIDInput,
      pai: TileInput,
      consumed: z.array(TileInput).length(3),
    }),
    z.object({
      type: z.literal('dora'),
      dora_marker: TileInput,
    }),
    z.object({
      type: z.literal('end_game'),
    }),
    z.object({
      type: z.literal('end_kyoku'),
    }),
    z.object({
      type: z.literal('hora'),
      actor: PlayerIDInput,
      target: PlayerIDInput,
      deltas: z.array(z.number()).length(4),
      ura_markers: z.array(TileInput).min(0).max(4),
    }),
    z.object({
      type: z.literal('kakan'),
      actor: PlayerIDInput,
      pai: TileInput,
      consumed: z.array(TileInput).length(3),
    }),
    z.object({
      type: z.literal('pon'),
      actor: PlayerIDInput,
      target: PlayerIDInput,
      pai: TileInput,
      consumed: z.array(TileInput).length(2),
    }),
    z.object({
      type: z.literal('reach'),
      actor: PlayerIDInput,
    }),
    z.object({
      type: z.literal('reach_accepted'),
      actor: PlayerIDInput,
    }),
    z.object({
      type: z.literal('ryukyoku'),
      deltas: z.array(z.number()).length(4),
    }),
    z.object({
      type: z.literal('start_game'),
      names: z.array(z.string()).length(4),
      kyoku_first: PlayerIDInput,
      aka_flag: z.boolean(),
    }),
    z.object({
      type: z.literal('start_kyoku'),
      bakaze: z.enum(['E', 'S', 'W']),
      dora_marker: TileInput,
      kyoku: z.number().min(0).max(11),
      honba: z.number().min(0),
      kyotaku: z.number().min(0),
      oya: PlayerIDInput,
      scores: z.array(z.number()).length(4),
      tehais: z.array(z.array(TileInput).length(13)).length(4),
    }),
    z.object({
      type: z.literal('tsumo'),
      actor: PlayerIDInput,
      pai: TileInput,
    }),
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
