import { Base } from './common/base';
import { PlayerID } from './common/PlayerID';

export interface ReachAccepted extends Base {
  type: 'reach_accepted';
  actor: PlayerID;
}
