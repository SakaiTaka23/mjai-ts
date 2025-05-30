import { Event, StartKyoku } from '@mjai/types';

import { InternalKyokuState } from './GameState';

export const KyokuState = (start: StartKyoku): InternalKyokuState => {
  const kyoku = start.kyoku;
  const honba = start.honba;
  let kyotaku = start.kyotaku;
  const bakaze = start.bakaze;
  const oya = start.oya;

  const handle = (event: Event): void => {
    if (event.type === 'reach_accepted') {
      kyotaku++;
    }
    return;
  };

  const get = () => ({
    kyoku,
    honba,
    kyotaku,
    bakaze,
    oya,
  });

  return {
    get,
    handle,
    kyoku: () => kyoku,
    honba: () => honba,
    kyotaku: () => kyotaku,
    bakaze: () => bakaze,
    oya: () => oya,
  };
};
