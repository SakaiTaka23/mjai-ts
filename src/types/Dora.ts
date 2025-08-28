import { Base } from './common/base';
import { Tile } from './common/Tiles';

export interface Dora extends Base {
  type: 'dora';
  doraMarker: Tile;
}
