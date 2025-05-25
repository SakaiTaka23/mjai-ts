import {
  Ankan,
  Chi,
  Dahai,
  Daiminkan,
  Event,
  Kakan,
  Pon,
  StartKyoku,
  Tsumo,
} from '@mjai/types';

import { InternalTehaiState } from './GameState';
import { HandState } from './types/Tehai';
import { removeTehai } from './utils/Editor';
import { sortHand } from './utils/SortHand';

export const TehaiState = (start: StartKyoku): InternalTehaiState => {
  let tehais: [HandState, HandState, HandState, HandState] = [
    {
      tehai: start.tehais[0],
      tsumo: null,
      fuuros: [],
    },
    {
      tehai: start.tehais[1],
      tsumo: null,
      fuuros: [],
    },
    {
      tehai: start.tehais[2],
      tsumo: null,
      fuuros: [],
    },
    {
      tehai: start.tehais[3],
      tsumo: null,
      fuuros: [],
    },
  ];
  const handlers = {
    ankan: ankanHandler,
    chi: chiHandler,
    tsumo: tsumoHandler,
    dahai: dahaiHandler,
    daiminkan: daiminkanHandler,
    kakan: kakanHandler,
    pon: ponHandler,
  };

  const handle = (event: Event): void => {
    switch (event.type) {
      case 'ankan':
        tehais = handlers.ankan.handle(event, tehais);
        break;
      case 'chi':
        tehais = handlers.chi.handle(event, tehais);
        break;
      case 'dahai':
        tehais = handlers.dahai.handle(event, tehais);
        break;
      case 'daiminkan':
        tehais = handlers.daiminkan.handle(event, tehais);
        break;
      case 'kakan':
        tehais = handlers.kakan.handle(event, tehais);
        break;
      case 'pon':
        tehais = handlers.pon.handle(event, tehais);
        break;
      case 'tsumo':
        tehais = handlers.tsumo.handle(event, tehais);
        break;
      case 'dora':
      case 'end_game':
      case 'end_kyoku':
      case 'hora':
      case 'reach':
      case 'reach_accepted':
      case 'ryukyoku':
      case 'start_game':
      case 'start_kyoku':
        break;
    }
  };

  const get = (): [HandState, HandState, HandState, HandState] =>
    structuredClone(tehais);

  return {
    handle,
    get,
  };
};

interface EventHandler<T extends Event> {
  handle(
    event: T,
    tehais: [HandState, HandState, HandState, HandState],
  ): [HandState, HandState, HandState, HandState];
}

const ankanHandler: EventHandler<Ankan> = {
  handle: (
    event: Ankan,
    tehais: [HandState, HandState, HandState, HandState],
  ): [HandState, HandState, HandState, HandState] => {
    const tehai = tehais[event.actor];
    if (event.consumed.includes(tehai.tsumo!)) {
      tehai.tehai.push(tehai.tsumo!);
      tehai.tsumo = null;
    }
    removeTehai(event.consumed[0], tehai.tehai);
    removeTehai(event.consumed[1], tehai.tehai);
    removeTehai(event.consumed[2], tehai.tehai);
    removeTehai(event.consumed[3], tehai.tehai);
    tehai.fuuros.push(event);

    tehais[event.actor] = tehai;
    return tehais;
  },
};

const chiHandler: EventHandler<Chi> = {
  handle: (
    event: Chi,
    tehais: [HandState, HandState, HandState, HandState],
  ): [HandState, HandState, HandState, HandState] => {
    const tehai = tehais[event.actor];

    removeTehai(event.consumed[0], tehai.tehai);
    removeTehai(event.consumed[1], tehai.tehai);
    tehai.fuuros.push(event);

    tehais[event.actor] = tehai;
    return tehais;
  },
};

const tsumoHandler: EventHandler<Tsumo> = {
  handle: (
    event: Tsumo,
    tehais: [HandState, HandState, HandState, HandState],
  ): [HandState, HandState, HandState, HandState] => {
    const tehai = tehais[event.actor];
    tehai.tsumo = event.pai;

    tehais[event.actor] = tehai;
    return tehais;
  },
};

const dahaiHandler: EventHandler<Dahai> = {
  handle(
    event: Dahai,
    tehais: [HandState, HandState, HandState, HandState],
  ): [HandState, HandState, HandState, HandState] {
    const tehai = tehais[event.actor];

    if (!event.tsumogiri) {
      tehai.tehai.push(event.pai);
      tehai.tehai = sortHand(removeTehai(event.pai, tehai.tehai));
    }

    tehai.tsumo = null;
    tehais[event.actor] = tehai;
    return tehais;
  },
};

const daiminkanHandler: EventHandler<Daiminkan> = {
  handle(
    event: Daiminkan,
    tehais: [HandState, HandState, HandState, HandState],
  ): [HandState, HandState, HandState, HandState] {
    const tehai = tehais[event.actor];

    removeTehai(event.consumed[0], tehai.tehai);
    removeTehai(event.consumed[1], tehai.tehai);
    removeTehai(event.consumed[2], tehai.tehai);
    tehai.fuuros.push(event);

    tehais[event.actor] = tehai;
    return tehais;
  },
};

const kakanHandler: EventHandler<Kakan> = {
  handle(
    event: Kakan,
    tehais: [HandState, HandState, HandState, HandState],
  ): [HandState, HandState, HandState, HandState] {
    const tehai = tehais[event.actor];
    tehai.fuuros = tehai.fuuros.filter(
      (fuuro) =>
        !(
          fuuro.type === 'pon' &&
          fuuro.pai === event.pai &&
          fuuro.consumed.every((tile) => event.consumed.includes(tile))
        ),
    );

    removeTehai(event.consumed[0], tehai.tehai);
    removeTehai(event.consumed[1], tehai.tehai);
    removeTehai(event.consumed[2], tehai.tehai);
    tehai.tsumo = null;
    tehai.fuuros.push(event);

    tehais[event.actor] = tehai;
    return tehais;
  },
};

const ponHandler: EventHandler<Pon> = {
  handle(
    event: Pon,
    tehais: [HandState, HandState, HandState, HandState],
  ): [HandState, HandState, HandState, HandState] {
    const tehai = tehais[event.actor];

    removeTehai(event.consumed[0], tehai.tehai);
    removeTehai(event.consumed[1], tehai.tehai);
    tehai.fuuros.push(event);

    tehais[event.actor] = tehai;
    return tehais;
  },
};
