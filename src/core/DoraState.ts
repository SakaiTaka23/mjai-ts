import { Event, StartKyoku, Tile } from '@types';

import { InternalDoraState } from './GameState';

export const DoraState = (start: StartKyoku): InternalDoraState => {
  const calcActualDora = (tile: Tile): Tile => {
    const suits = ['m', 'p', 's'] as const;

    for (const suit of suits) {
      if (tile.endsWith(suit)) {
        const num = parseInt(tile[0]);
        if (!isNaN(num)) {
          const nextNum = num === 9 ? 1 : num + 1;
          return `${nextNum}${suit}` as Tile;
        }
      }
    }

    const winds: Tile[] = ['E', 'S', 'W', 'N'];
    const windIndex = winds.indexOf(tile);
    if (windIndex !== -1) {
      return winds[(windIndex + 1) % 4];
    }

    const dragons: Tile[] = ['P', 'F', 'C'];
    const dragonIndex = dragons.indexOf(tile);
    if (dragonIndex !== -1) {
      return dragons[(dragonIndex + 1) % 3];
    }

    if (tile === '5mr') return '6m';
    if (tile === '5pr') return '6p';
    if (tile === '5sr') return '6s';

    if (tile === '?') return '?';

    return tile;
  };

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
