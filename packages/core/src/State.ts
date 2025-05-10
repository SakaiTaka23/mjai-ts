import { StartKyoku } from '@mjai/types';

import { DoraState } from './DoraState';
import { GameState } from './GameState';
import { KawaState } from './KawaState';
import { ScoreState } from './ScoreState';
import { TehaiState } from './TehaiState';

export const createGameState = (start: StartKyoku): GameState => {
  const tehaiState = TehaiState(start);
  const doraState = DoraState(start);
  const scoreState = ScoreState(start);
  const kawaState = KawaState();

  return {
    TehaiState: tehaiState,
    DoraState: doraState,
    ScoreState: scoreState,
    KawaState: kawaState,
  };
};
