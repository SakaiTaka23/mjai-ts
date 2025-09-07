import { Event, PlayerID, Tile } from '@types';

import { BaseState, InternalBaseState } from './BaseState';
import { Kawa } from './types/Kawa';
import { Fuuro, HandState } from './types/Tehai';

export interface GameState {
  TehaiState: TehaiState;
  DoraState: DoraState;
  ScoreState: ScoreState;
  KawaState: KawaState;
  KyokuState: KyokuState;
  handle: (e: Event) => void;
}

//  extend so that we can add more utility functions
export interface TehaiState
  extends BaseState<[HandState, HandState, HandState, HandState]> {
  fuuros(): [Fuuro[], Fuuro[], Fuuro[], Fuuro[]];
}

export interface DoraState extends BaseState<Tile[]> {
  getActualDora(): Tile[];
}

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

export interface KyokuState
  extends BaseState<{
    kyoku: number;
    honba: number;
    kyotaku: number;
    bakaze: 'E' | 'S' | 'W';
    oya: PlayerID;
    reachPlayers: Set<PlayerID>;
    junme: number;
  }> {
  kyoku(): number;

  honba(): number;

  kyotaku(): number;

  bakaze(): 'E' | 'S' | 'W';

  oya(): PlayerID;

  reachPlayers(): Set<PlayerID>;

  junme(): number;
}

export interface InternalGameState {
  TehaiState: InternalTehaiState;
  DoraState: InternalDoraState;
  ScoreState: InternalScoreState;
  KawaState: InternalKawaState;
  KyokuState: InternalKyokuState;

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

export interface InternalKyokuState
  extends KyokuState,
    InternalBaseState<{
      kyoku: number;
      honba: number;
      kyotaku: number;
      bakaze: 'E' | 'S' | 'W';
      oya: PlayerID;
      reachPlayers: Set<PlayerID>;
      junme: number;
    }> {}
