import { Base } from './common/base';
import { PlayerID } from './common/PlayerID';
import { Tile } from './common/Tiles';

export interface Hora extends Base {
  type: 'hora';
  actor: PlayerID;
  target: PlayerID;
  deltas: [number, number, number, number];
  uraMarkers: Tile[];
}
