import { Base } from './common/base';
import { PlayerID } from './common/PlayerID';
import { Tile } from './common/Tiles';

export interface Kakan extends Base {
  type: 'kakan';
  actor: PlayerID;
  pai: Tile;
  consumed: [Tile, Tile, Tile];
}
