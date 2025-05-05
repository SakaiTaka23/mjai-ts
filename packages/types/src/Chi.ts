import { Base } from './common/base';
import { PlayerID } from './common/PlayerID';
import { Tile } from './common/Tiles';

export interface Chi extends Base {
  type: 'chi';
  actor: PlayerID;
  target: PlayerID;
  pai: Tile;
  consumed: [Tile, Tile];
}
