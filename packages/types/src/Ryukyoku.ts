import { Base } from './common/base';

export interface Ryukyoku extends Base {
  type: 'ryukyoku';
  deltas: [number, number, number, number];
}
