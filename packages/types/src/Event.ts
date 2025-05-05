import { Ankan } from './Ankan';
import { Chi } from './Chi';
import { Dahai } from './Dahai';
import { Daiminkan } from './Daiminkan';
import { Dora } from './Dora';
import { EndGame } from './EndGame';
import { EndKyoku } from './EndKyoku';
import { Hora } from './Hora';
import { Kakan } from './Kakan';
import { Pon } from './Pon';
import { Reach } from './Reach';
import { ReachAccepted } from './ReachAccepted';
import { Ryukyoku } from './Ryukyoku';
import { StartGame } from './StartGame';
import { StartKyoku } from './StartKyoku';
import { Tsumo } from './Tsumo';

export type Event =
  | Ankan
  | Chi
  | Dahai
  | Daiminkan
  | Dora
  | EndGame
  | EndKyoku
  | Hora
  | Kakan
  | Pon
  | Reach
  | ReachAccepted
  | Ryukyoku
  | StartGame
  | StartKyoku
  | Tsumo;
