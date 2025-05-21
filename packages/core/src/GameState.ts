import { Event, Tile } from '@mjai/types';

import { BaseState, InternalBaseState } from './BaseState';
import { Kawa } from './types/Kawa';
import { HandState } from './types/Tehai';

export interface GameState {
  TehaiState: TehaiState;
  DoraState: DoraState;
  ScoreState: ScoreState;
  KawaState: KawaState;
  handle: (e: Event) => void;
}

//  extend so that we can add more utility functions
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TehaiState
  extends BaseState<[HandState, HandState, HandState, HandState]> {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DoraState extends BaseState<Tile[]> {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ScoreState
  extends BaseState<[number, number, number, number]> {}

export interface KawaState
  extends BaseState<{
    kawas: [Kawa, Kawa, Kawa, Kawa];
    remaining: number;
  }> {
  remaining(): number;
}

export interface InternalGameState {
  TehaiState: InternalTehaiState;
  DoraState: InternalDoraState;
  ScoreState: InternalScoreState;
  KawaState: InternalKawaState;

  handle(event: Event): void;
}

export interface InternalTehaiState
  extends TehaiState,
    InternalBaseState<[HandState, HandState, HandState, HandState]> {}

export interface InternalDoraState
  extends DoraState,
    InternalBaseState<Tile[]> {}

export interface InternalScoreState
  extends ScoreState,
    InternalBaseState<[number, number, number, number]> {}

export interface InternalKawaState
  extends KawaState,
    InternalBaseState<{
      kawas: [Kawa, Kawa, Kawa, Kawa];
      remaining: number;
    }> {}
