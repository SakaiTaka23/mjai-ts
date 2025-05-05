import { Base } from './common/base';
import { PlayerID } from './common/PlayerID';

export interface StartGame extends Base {
  type: 'start_game';
  names: [string, string, string, string];
  kyokuFirst: PlayerID;
  akaFlag: boolean;
}
