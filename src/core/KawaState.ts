import {
  Chi,
  Dahai,
  Daiminkan,
  Event,
  PlayerID,
  Pon,
  Reach,
  ReachAccepted,
  Tsumo,
} from '@types';

import { InternalKawaState } from './GameState';
import { Kawa } from './types/Kawa';

interface State {
  kawas: [Kawa, Kawa, Kawa, Kawa];
  remaining: number;
  isHaiteiHotei: boolean;
}

export const KawaState = (): InternalKawaState => {
  let kawas: State = {
    kawas: [
      {
        sutehai: [],
        nakiIndex: [],
        reachIndex: null,
      },
      {
        sutehai: [],
        nakiIndex: [],
        reachIndex: null,
      },
      {
        sutehai: [],
        nakiIndex: [],
        reachIndex: null,
      },
      {
        sutehai: [],
        nakiIndex: [],
        reachIndex: null,
      },
    ],
    remaining: 70,
    isHaiteiHotei: false,
  };
  const handlers = {
    dahai: dahaiHandler,
    tsumo: tsumoHandler,
    naki: nakiHandler,
    reach: reachHandler,
    reachAccepted: reachAcceptedHandler,
  };
  let reachCalled: PlayerID | null = null;

  const handle = (event: Event): void => {
    switch (event.type) {
      case 'dahai':
        kawas = handlers.dahai(event, kawas, reachCalled);
        break;
      case 'tsumo':
        kawas = handlers.tsumo(event, kawas);
        break;
      case 'chi':
      case 'daiminkan':
      case 'pon':
        kawas = handlers.naki(event, kawas);
        break;
      case 'reach':
        reachCalled = handlers.reach(event, kawas);
        break;
      case 'reach_accepted':
        reachCalled = handlers.reachAccepted(event, kawas);
        break;
    }

    if (kawas.remaining === 0) {
      kawas.isHaiteiHotei = true;
    }

    return;
  };

  const get = (): State => {
    return {
      kawas: kawas.kawas,
      remaining: kawas.remaining,
      isHaiteiHotei: kawas.isHaiteiHotei,
    };
  };

  return {
    handle,
    get,
    kawas: () => structuredClone(kawas.kawas),
    remaining: (): number => kawas.remaining,
    isHaiteiHotei: () => kawas.isHaiteiHotei,
  };
};

const dahaiHandler = (
  event: Dahai,
  kawa: State,
  reachFlag: PlayerID | null,
): State => {
  kawa.kawas[event.actor].sutehai.push(event.pai);

  if (reachFlag != null) {
    kawa.kawas[event.actor].reachIndex =
      kawa.kawas[event.actor].sutehai.length - 1;
  }

  return kawa;
};

const tsumoHandler = (_event: Tsumo, kawa: State): State => {
  kawa.remaining--;

  return kawa;
};

type kawaChangeFuuro = Chi | Daiminkan | Pon;
const nakiHandler = (event: kawaChangeFuuro, kawa: State): State => {
  kawa.kawas[event.target].nakiIndex.push(
    kawa.kawas[event.target].sutehai.length - 1,
  );

  return kawa;
};

const reachHandler = (event: Reach, _kawa: State): PlayerID => {
  return event.actor;
};

const reachAcceptedHandler = (_event: ReachAccepted, _kawa: State) => null;
