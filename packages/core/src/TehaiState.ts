import { Ankan, Event, StartKyoku } from '@mjai/types';

import { BaseState } from './BaseState';
import { HandState } from './types/Tehai';

export const TehaiState = (start: StartKyoku): BaseState => {
  const tehais: [HandState, HandState, HandState, HandState] = [
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
  };

  const handle = (event: Event): boolean => {
    switch (event.type) {
      case 'ankan':
        return handlers.ankan.handle(event, tehais);
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
        break;
    }
    return false;
  };

  return {
    handle,
  };
};

interface EventHandler<T extends Event> {
  handle(
    event: T,
    tehais: [HandState, HandState, HandState, HandState],
  ): boolean;
}

const ankanHandler: EventHandler<Ankan> = {
  handle: (
    event: Ankan,
    tehais: [HandState, HandState, HandState, HandState],
  ): boolean => {
    const tehai = tehais[event.actor];

    return true;
  },
};
