import { Event, StartKyoku, Tile } from '@mjai/types';

import { BaseState } from './BaseState';

export const DoraState = (start: StartKyoku): BaseState<Tile[]> => {
  const doraMarkers: Tile[] = [start.doraMarker];

  const handle = (event: Event): void => {
    if (event.type === 'dora') {
      doraMarkers.push(event.doraMarker);
    }

    return;
  };

  const get = (): Tile[] => doraMarkers;

  return {
    handle,
    get,
  };
};
