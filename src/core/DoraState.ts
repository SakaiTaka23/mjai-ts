import { Event, StartKyoku, Tile } from '@types';

import { InternalDoraState } from './GameState';

export const DoraState = (start: StartKyoku): InternalDoraState => {
  const doraMarkers: Tile[] = [start.doraMarker];

  const handle = (event: Event): void => {
    if (event.type === 'dora') {
      doraMarkers.push(event.doraMarker);
    }

    return;
  };

  const get = (): Tile[] => structuredClone(doraMarkers);

  return {
    handle,
    get,
  };
};
