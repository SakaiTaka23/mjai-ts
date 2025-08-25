import { Base } from './common/base';
import { PlayerID } from './common/PlayerID';
import { Tile } from './common/Tiles';

export interface Ankan extends Base {
  type: 'ankan';
  actor: PlayerID;
  consumed: [Tile, Tile, Tile, Tile];
}
