import { StartKyoku } from '@mjai/types';

import { GameState } from './GameState';
import { TehaiState } from './TehaiState';

export const createGameState = (start: StartKyoku): GameState => {
  const tehaiState = TehaiState(start);

  return {
    TehaiState: tehaiState,
  };
};
