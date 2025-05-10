import { StartKyoku } from '@mjai/types';

import { DoraState } from './DoraState';
import { GameState } from './GameState';
import { TehaiState } from './TehaiState';

export const createGameState = (start: StartKyoku): GameState => {
  const tehaiState = TehaiState(start);
  const doraState = DoraState(start);

  return {
    TehaiState: tehaiState,
    DoraState: doraState,
  };
};
