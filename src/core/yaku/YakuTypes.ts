export type Hai = 0 | 1 | 2 | 3 | 4;
export type HaiArr = [
  [Hai, Hai, Hai, Hai, Hai, Hai, Hai, Hai, Hai],
  [Hai, Hai, Hai, Hai, Hai, Hai, Hai, Hai, Hai],
  [Hai, Hai, Hai, Hai, Hai, Hai, Hai, Hai, Hai],
  [Hai, Hai, Hai, Hai, Hai, Hai, Hai],
];

export type HaiString = string;

export type MentsuPattern = HaiString | HaiString[];

export type AgariPattern = MentsuPattern[];

export type YakuName =
  // 役満
  | '国士無双十三面待ち'
  | '国士無双'
  | '純正九蓮宝燈'
  | '九蓮宝燈'
  | '四暗刻単騎待ち'
  | '四暗刻'
  | '大四喜'
  | '小四喜'
  | '大三元'
  | '字一色'
  | '緑一色'
  | '清老頭'
  | '四槓子'
  | '天和'
  | '地和'
  | '人和'
  | '大七星'
  // 通常役
  | '清一色'
  | '混一色'
  | '二盃口'
  | '純全帯么九'
  | '混全帯么九'
  | '対々和'
  | '混老頭'
  | '三槓子'
  | '小三元'
  | '三色同刻'
  | '三暗刻'
  | '七対子'
  | 'ダブル立直'
  | '一気通貫'
  | '三色同順'
  | '断么九'
  | '平和'
  | '一盃口'
  | '門前清自摸和'
  | '立直'
  | '一発'
  | '嶺上開花'
  | '搶槓'
  | '海底摸月'
  | '河底撈魚'
  | '場風東'
  | '場風南'
  | '場風西'
  | '場風北'
  | '自風東'
  | '自風南'
  | '自風西'
  | '自風北'
  | '役牌白'
  | '役牌発'
  | '役牌中'
  // ドラ
  | 'ドラ'
  | '裏ドラ'
  | '赤ドラ';

export type YakuValue =
  | { type: 'han'; count: number } // 通常役: 1-5飜など
  | { type: 'yakuman'; multiplier: 1 | 2 }; // 役満: 1倍 or 2倍

export interface YakuEntry {
  name: YakuName;
  value: YakuValue;
}

export type ScoreName =
  | ''
  | '満貫'
  | '跳満'
  | '倍満'
  | '三倍満'
  | '数え役満'
  | '役満'
  | '2倍役満'
  | '3倍役満'
  | '4倍役満'
  | '5倍役満'
  | '6倍役満';

export type Kaze = '東' | '南' | '西' | '北';
export type AgariType = 'tsumo' | 'ron';
export interface HairiResult {
  now: number;
  wait: Map<string, number> | undefined;
  [key: string]: Map<string, number> | number | undefined;
}

export interface RiichiCalcResult {
  isAgari: boolean;
  error: boolean;
  yakuman: number;
  yaku: YakuEntry[];
  han: number;
  fu: number;
  ten: number;
  name: ScoreName;
  scoreInfo: {
    bakaze: Kaze;
    jikaze: Kaze;
    agariType: AgariType;
  };
  payment:
    | {
        type: 'tsumo';
        fromOya: number;
        fromKo: number;
      }
    | {
        type: 'ron';
        amount: number;
      };
  hairi?: HairiResult;
  hairi7and13?: HairiResult;
}
