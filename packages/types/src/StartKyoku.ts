import { Base } from './common/base';
import { PlayerID } from './common/PlayerID';
import { Tile } from './common/Tiles';

export interface StartKyoku extends Base {
  type: 'start_kyoku';
  bakaze: 'E' | 'S' | 'W';
  doraMarker: Tile;
  kyoku: number;
  honba: number;
  kyotaku: number;
  oya: PlayerID;
  scores: [number, number, number, number];
  tehais: [InitialTehai, InitialTehai, InitialTehai, InitialTehai];
}

type InitialTehai = [
  Tile,
  Tile,
  Tile,
  Tile,
  Tile,
  Tile,
  Tile,
  Tile,
  Tile,
  Tile,
  Tile,
  Tile,
  Tile,
];
