import { Ankan, Chi, Daiminkan, Kakan, Pon, Tile } from '@mjai/types';

export interface HandState {
  tehai: Tile[];
  tsumo: Tile | null;
  fuuros: Fuuro[];
}

type Fuuro = Ankan | Chi | Daiminkan | Kakan | Pon;
