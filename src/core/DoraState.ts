import { Event, StartKyoku, Tile } from '@types';

import { InternalDoraState } from './GameState';
import { calcActualDora } from './utils/CalcActualDora';

export const DoraState = (start: StartKyoku): InternalDoraState => {
  const doraMarkers: Tile[] = [start.doraMarker];
  const actualDoras: Tile[] = [calcActualDora(start.doraMarker)];

  const handle = (event: Event): void => {
    if (event.type === 'dora') {
      doraMarkers.push(event.doraMarker);
      actualDoras.push(calcActualDora(event.doraMarker));
    }

    return;
  };

  const get = (): Tile[] => structuredClone(doraMarkers);

  const getActualDora = (): Tile[] => {
    return structuredClone(actualDoras);
  };

  return {
    handle,
    get,
    getActualDora,
  };
};
