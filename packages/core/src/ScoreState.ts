import { Event, StartKyoku } from '@mjai/types';

import { InternalBaseState } from './BaseState';

export const ScoreState = (
  start: StartKyoku,
): InternalBaseState<[number, number, number, number]> => {
  const scores: [number, number, number, number] = start.scores;

  const handle = (event: Event): void => {
    if (event.type === 'reach_accepted') {
      scores[event.actor] -= 1000;
    }

    return;
  };

  const get = (): [number, number, number, number] => scores;

  return {
    handle,
    get,
  };
};
