import { Tile } from '@mjai/types';

import { BaseState } from './BaseState';
import { HandState } from './types/Tehai';

export interface GameState {
  TehaiState: TehaiState;
  DoraState: DoraState;
  ScoreState: ScoreState;
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
