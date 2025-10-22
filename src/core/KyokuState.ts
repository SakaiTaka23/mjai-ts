import { Event, PlayerID, StartKyoku } from '@types';

import { InternalKyokuState } from './GameState';

export const KyokuState = (start: StartKyoku): InternalKyokuState => {
  const kyoku = start.kyoku;
  const honba = start.honba;
  let kyotaku = start.kyotaku;
  const bakaze = start.bakaze;
  const oya = start.oya;
  let isChankanRinshan = false;
  let isTenChiho: [boolean, boolean, boolean, boolean] = [
    true,
    true,
    true,
    true,
  ];
  const reachPlayers = new Set<{
    playerId: PlayerID;
    isIpatsu: boolean;
    isDoubleReach: boolean;
  }>([]);
  let junme = 0;
  let isDoubleReach: [boolean, boolean, boolean, boolean] = [
    true,
    true,
    true,
    true,
  ];

  const handle = (event: Event): void => {
    if (event.type === 'reach_accepted') {
      kyotaku++;
      reachPlayers.add({
        playerId: event.actor,
        isIpatsu: true,
        isDoubleReach: isDoubleReach[event.actor],
      });
    } else if (event.type === 'dahai' && event.actor === oya) {
      junme++;
    } else if (
      event.type === 'ankan' ||
      event.type === 'daiminkan' ||
      event.type === 'chi' ||
      event.type === 'kakan' ||
      event.type === 'pon'
    ) {
      isTenChiho = [false, false, false, false];
      isDoubleReach = [false, false, false, false];

      for (const rp of reachPlayers) {
        rp.isIpatsu = false;
      }
    }

    if (
      event.type === 'ankan' ||
      event.type === 'daiminkan' ||
      event.type === 'kakan'
    ) {
      isChankanRinshan = true;
    }
    if (event.type === 'dahai') {
      isChankanRinshan = false;
      isTenChiho[event.actor] = false;
      isDoubleReach[event.actor] = false;

      for (const rp of reachPlayers) {
        if (rp.playerId === event.actor) {
          rp.isIpatsu = false;
        }
      }
    }
    return;
  };

  const get = () => ({
    kyoku,
    honba,
    kyotaku,
    bakaze,
    oya,
    isChankanRinshan,
    isTenChiho,
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
    isTenChiho: () => [...isTenChiho],
    isChankanRinshan: () => isChankanRinshan,
    reachPlayers: () => reachPlayers,
    junme: () => junme,
  };
};
