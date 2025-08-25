import { Base } from './common/base';
import { PlayerID } from './common/PlayerID';
import { Tile } from './common/Tiles';

export interface Dahai extends Base {
  type: 'dahai';
  actor: PlayerID;
  pai: Tile;
  tsumogiri: boolean;
}
