import { Base } from './common/base';
import { PlayerID } from './common/PlayerID';
import { Tile } from './common/Tiles';

export interface Pon extends Base {
  type: 'pon';
  actor: PlayerID;
  target: PlayerID;
  pai: Tile;
  consumed: [Tile, Tile];
}
