import { Ankan, Event, StartKyoku, Tsumo } from '@mjai/types';

import { BaseState } from './BaseState';
import { HandState } from './types/Tehai';
import { removeTehai } from './utils/Editor';

export const TehaiState = (
  start: StartKyoku,
): BaseState<[HandState, HandState, HandState, HandState]> => {
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
    tsumo: tsumoHandler,
  };

  const handle = (event: Event): void => {
    switch (event.type) {
      case 'ankan':
        tehais = handlers.ankan.handle(event, tehais);
        break;
      case 'chi':
        break;
      case 'dahai':
        break;
      case 'daiminkan':
        break;
      case 'dora':
        break;
      case 'endgame':
        break;
      case 'end_kyoku':
        break;
      case 'hora':
        break;
      case 'kakan':
        break;
      case 'pon':
        break;
      case 'reach':
        break;
      case 'reach_accepted':
        break;
      case 'ryukyoku':
        break;
      case 'start_game':
        break;
      case 'start_kyoku':
        break;
      case 'tsumo':
        tehais = handlers.tsumo.handle(event, tehais);
        break;
    }
  };

  const get = (): [HandState, HandState, HandState, HandState] => {
    return tehais;
  };

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
    tehai.fuuros.push({
      type: 'ankan',
      consumed: event.consumed,
      actor: '0',
    });

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
