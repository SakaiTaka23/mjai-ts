import { StartKyoku, Tile } from '@mjai/types';

import { HandState } from './types/Tehai';

interface GameState {
  applyEvent(event: Event): void;
  getTehais(): [HandState, HandState, HandState, HandState];
  getKawas(): [Tile[], Tile[], Tile[], Tile[]];
  getScores(): [number, number, number, number];
  getDora(): Tile[];
}

export const createGameState = (start: StartKyoku): GameState => {
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
  const kawas: [Tile[], Tile[], Tile[], Tile[]] = [[], [], [], []];
  const scores: [number, number, number, number] = start.scores;
  const dora: Tile[] = [];

  const applyEvent = (event: Event) => {
    return;
  };

  const getTehais = () => {
    return tehais;
  };

  const getKawas = () => {
    return kawas;
  };

  const getScores = () => {
    return scores;
  };

  const getDora = () => {
    return dora;
  };

  return {
    applyEvent,
    getTehais,
    getKawas,
    getScores,
    getDora,
  };
};
