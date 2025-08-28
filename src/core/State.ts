import { Event, StartKyoku } from '@types';

import { DoraState } from './DoraState';
import { GameState, InternalGameState } from './GameState';
import { KawaState } from './KawaState';
import { KyokuState } from './KyokuState';
import { ScoreState } from './ScoreState';
import { TehaiState } from './TehaiState';

const createInternalGameState = (start: StartKyoku): InternalGameState => {
  const tehaiState = TehaiState(start);
  const doraState = DoraState(start);
  const scoreState = ScoreState(start);
  const kawaState = KawaState();
  const kyokuState = KyokuState(start);

  const handle = (event: Event) => {
    tehaiState.handle(event);
    doraState.handle(event);
    scoreState.handle(event);
    kawaState.handle(event);
    kyokuState.handle(event);
  };

  return {
    TehaiState: tehaiState,
    DoraState: doraState,
    ScoreState: scoreState,
    KawaState: kawaState,
    KyokuState: kyokuState,
    handle,
  };
};

export const createGameState = (start: StartKyoku): GameState => {
  const internal = createInternalGameState(start);

  return {
    TehaiState: internal.TehaiState,
    DoraState: internal.DoraState,
    ScoreState: internal.ScoreState,
    KawaState: internal.KawaState,
    KyokuState: internal.KyokuState,
    handle: (e: Event) => internal.handle(e),
  };
};
