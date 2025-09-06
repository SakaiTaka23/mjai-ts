import { Event, PlayerID, StartKyoku } from '@types';

import { InternalKyokuState } from './GameState';

export const KyokuState = (start: StartKyoku): InternalKyokuState => {
  const kyoku = start.kyoku;
  const honba = start.honba;
  let kyotaku = start.kyotaku;
  const bakaze = start.bakaze;
  const oya = start.oya;
  const reachPlayers = new Set<PlayerID>([]);
  let junme = 0;

  const handle = (event: Event): void => {
    if (event.type === 'reach_accepted') {
      kyotaku++;
      reachPlayers.add(event.actor);
    } else if (event.type === 'dahai' && event.actor === oya) {
      junme++;
    }
    return;
  };

  const get = () => ({
    kyoku,
    honba,
    kyotaku,
    bakaze,
    oya,
    reachPlayers,
    junme,
  });

  return {
    get,
    handle,
    kyoku: () => kyoku,
    honba: () => honba,
    kyotaku: () => kyotaku,
    bakaze: () => bakaze,
    oya: () => oya,
    reachPlayers: () => reachPlayers,
    junme: () => junme,
  };
};
