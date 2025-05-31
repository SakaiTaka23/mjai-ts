import { Ankan, Chi, Daiminkan, PlayerID, Pon, Tile } from '@mjai/types';

export interface HandState {
  tehai: Tile[];
  tsumo: Tile | null;
  fuuros: Fuuro[];
}

export interface KakanFuuro {
  type: 'kakan';
  actor: PlayerID;
  pai: Tile;
  consumed: [Tile, Tile, Tile];
  ponTarget: PlayerID;
  ponPai: Tile;
  ponConsumed: [Tile, Tile];
}

export type Fuuro = Ankan | Chi | Daiminkan | KakanFuuro | Pon;
