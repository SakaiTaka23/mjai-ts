import { Base } from './common/base';
import { PlayerID } from './common/PlayerID';
import { Tile } from './common/Tiles';

export interface Tsumo extends Base {
  type: 'tsumo';
  actor: PlayerID;
  pai: Tile;
}
