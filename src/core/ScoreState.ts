import { Event, StartKyoku } from '@types';

import { InternalScoreState } from './GameState';

export const ScoreState = (start: StartKyoku): InternalScoreState => {
  const scores: [number, number, number, number] = start.scores;

  const handle = (event: Event): void => {
    if (event.type === 'reach_accepted') {
      scores[event.actor] -= 1000;
    }

    return;
  };

  const get = (): [number, number, number, number] => [...scores];

  return {
    handle,
    get,
  };
};
