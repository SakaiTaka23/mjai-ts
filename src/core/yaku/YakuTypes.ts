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

export type YakuResult = Record<string, string>;

export interface HairiResult {
  now: number;
  wait: Map<string, number> | undefined;
  [key: string]: Map<string, number> | number | undefined;
}

export interface RiichiCalcResult {
  isAgari: boolean;
  yakuman: number;
  yaku: YakuResult;
  han: number;
  fu: number;
  ten: number;
  name: string;
  text: string;
  oya: number[];
  ko: number[];
  error: boolean;
  hairi?: HairiResult;
  hairi7and13?: HairiResult;
}
