import { Base } from './common/base';
import { PlayerID } from './common/PlayerID';

export interface Reach extends Base {
  type: 'reach';
  actor: PlayerID;
}
