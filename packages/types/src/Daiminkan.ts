import { Base } from './common/base';
import { PlayerID } from './common/PlayerID';
import { Tile } from './common/Tiles';

export interface Daiminkan extends Base {
  type: 'daiminkan';
  actor: PlayerID;
  target: PlayerID;
  pai: Tile;
  consumed: [Tile, Tile, Tile];
}
