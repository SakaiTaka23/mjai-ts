import { Event, StartKyoku, Tile } from '@mjai/types';

import { InternalBaseState } from './BaseState';

export const DoraState = (start: StartKyoku): InternalBaseState<Tile[]> => {
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
