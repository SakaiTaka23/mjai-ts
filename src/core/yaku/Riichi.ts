/*
 * Copyright (C) https://github.com/takayama-lily/riichi
 */
import { checkAll, findAllAgariPatterns } from './Agari';
import { hairi } from './Shanten';
import { YAKU } from './Yaku';
import {
  HaiArr,
  HaiString,
  AgariPattern,
  RiichiCalcResult,
  Kaze,
  YakuName,
} from './YakuTypes';

const MPSZ = ['m', 'p', 's', 'z'];

const numberToKaze = (num: number): Kaze => {
  const kazeMap: Record<number, Kaze> = {
    1: 'E',
    2: 'S',
    3: 'W',
    4: 'N',
  };
  return kazeMap[num] || '東';
};

const ceil10 = (num: number) => {
  return Math.ceil(num / 10) * 10;
};

const ceil100 = (num: number) => {
  return Math.ceil(num / 100) * 100;
};

const isHai = (text: string) => {
  return (
    typeof text === 'string' &&
    text.length === 2 &&
    !isNaN(Number(text[0])) &&
    MPSZ.includes(text[1])
  );
};

const is19 = (text: string) => {
  return (
    isHai(text) &&
    (text.includes('1') || text.includes('9') || text.includes('z'))
  );
};

const isFuro = (arr: string[]) => {
  if (arr instanceof Array !== true || arr.length > 4 || arr.length < 2)
    return false;
  const set = new Set(arr);
  if (set.size === 1) return isHai(arr[0]);
  else {
    if (set.size !== 3) return false;
    const minus1 = parseInt(arr[1]) - parseInt(arr[0]);
    const minus2 = parseInt(arr[2]) - parseInt(arr[1]);
    if (minus1 !== minus2 || minus1 !== 1) return false;
  }
  return true;
};

/**
 * string型牌 → array型牌
 * 赤dora抽出
 */
const parse = (text: string) => {
  const tmp: string[] = [];
  let aka = 0;
  for (let v of text) {
    if (!isNaN(Number(v))) {
      if (v === '0') {
        v = '5';
        aka++;
      }
      tmp.push(v);
    }
    if (MPSZ.includes(v)) {
      for (let k = 0; k < tmp.length; k++) {
        if (!isNaN(Number(tmp[k]))) tmp[k] += v;
      }
    }
  }
  const res = [];
  for (const v of tmp) if (isNaN(Number(v))) res.push(v);
  return { res: tmp, aka: aka };
};

class Riichi {
  hai: HaiString[];
  haiArray: HaiArr;
  furo: HaiString[][];
  agari: HaiString;
  dora: HaiString[];
  uraDora: HaiString[];
  extra: string;
  isTsumo: boolean;
  isOya: boolean;
  bakaze: number;
  jikaze: number;
  aka: number;
  agariPatterns: AgariPattern[];
  currentPattern: AgariPattern;
  tmpResult: RiichiCalcResult;
  finalResult: RiichiCalcResult;
  allLocalEnabled: boolean;
  localEnabled: string[];
  disabled: string[];
  allowWyakuman: boolean;
  allowKuitan: boolean;
  allowAka: boolean;
  hairi: boolean;

  /**
   * @param string data
   */
  constructor(data: string) {
    this.hai = [];
    this.haiArray = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
    this.furo = [];
    this.agari = '';
    this.dora = [];
    this.uraDora = [];
    this.extra = '';
    this.isTsumo = true;
    this.isOya = false;
    this.bakaze = 1;
    this.jikaze = 2;
    this.aka = 0;
    this.agariPatterns = [];
    this.currentPattern = [];
    this.tmpResult = {
      isAgari: false,
      yakuman: 0,
      yaku: [],
      han: 0,
      fu: 0,
      ten: 0,
      name: '',
      scoreInfo: {
        bakaze: 'E',
        jikaze: 'S',
        agariType: 'tsumo',
      },
      payment: {
        type: 'tsumo',
        fromOya: 0,
        fromKo: 0,
      },
      error: true,
    };
    this.finalResult = {
      isAgari: false,
      yakuman: 0,
      yaku: [],
      han: 0,
      fu: 0,
      ten: 0,
      name: '',
      scoreInfo: {
        bakaze: 'E',
        jikaze: 'S',
        agariType: 'tsumo',
      },
      payment: {
        type: 'tsumo',
        fromOya: 0,
        fromKo: 0,
      },
      error: true,
    };

    this.allLocalEnabled = false;
    this.localEnabled = [];
    this.disabled = [];
    this.allowWyakuman = true;
    this.allowKuitan = true;
    this.allowAka = true;
    this.hairi = true;

    // 初期設定
    if (typeof data !== 'string') return;
    data = data.toLowerCase();
    const arr = data.split('+');
    let hai = arr.shift()!;
    for (const v of arr) {
      if (
        !v.includes('m') &&
        !v.includes('p') &&
        !v.includes('s') &&
        !v.includes('z')
      )
        this.extra = v;
      else if (v.startsWith('d')) this.dora = parse(v.substr(1)).res;
      else if (v.startsWith('u')) this.uraDora = parse(v.substr(1)).res;
      else if (isHai(v)) {
        hai += v;
        this.isTsumo = false;
      } else {
        let tmp = [];
        for (let vv of v) {
          if (MPSZ.includes(vv)) {
            for (let k = 0; k < tmp.length; k++) {
              tmp[k] += vv;
            }
            if (isFuro(tmp)) this.furo.push(tmp.sort());
            tmp = [];
          } else {
            if (vv === '0') {
              vv = '5';
              this.aka++;
            }
            tmp.push(vv);
          }
        }
      }
    }

    const tmp = parse(hai);
    this.hai = tmp.res;
    this.aka += tmp.aka;
    this.agari = this.hai.slice(-1)[0];

    if (this.hai.length % 3 === 0) return;
    if (this.hai.length + this.furo.length * 3 > 14) return;

    // array型手牌 → 複合array型 転換
    for (const v of this.hai) {
      const n = parseInt(v);
      const i = MPSZ.indexOf(v.replace(String(n), ''));
      this.haiArray[i][n - 1]++;
    }

    // 場風自風設定
    const kaze = this.extra.replace(/[a-z]/g, '');
    if (kaze.length === 1) this.jikaze = parseInt(kaze);
    if (kaze.length > 1) {
      this.bakaze = parseInt(kaze[0]);
      this.jikaze = parseInt(kaze[1]);
    }
    if (this.jikaze === 1) this.isOya = true;
    else this.isOya = false;

    this.tmpResult.error = false;
    this.finalResult = JSON.parse(
      JSON.stringify(this.tmpResult),
    ) as RiichiCalcResult;
  }

  /**
   * 門前判定
   */
  isMenzen() {
    for (const v of this.furo) if (v.length > 2) return false;
    return true;
  }

  /**
   * dora枚数計算
   */
  calcDora() {
    if (!this.tmpResult.han) return;
    let dora = 0;
    for (const v of this.hai) {
      for (const vv of this.dora) {
        if (v === vv) dora++;
      }
    }
    for (let v of this.furo) {
      if (v.length === 2) v = v.concat(v);
      for (const vv of v) {
        for (const vvv of this.dora) {
          if (vvv === vv) dora++;
        }
      }
    }
    if (dora) {
      this.tmpResult.han += dora;
      this.tmpResult.yaku.push({
        name: 'ドラ',
        value: { type: 'han', count: dora },
      });
    }

    // 裏ドラ calculation (only when riichi is present)
    const hasRiichi =
      this.extra.includes('r') ||
      this.extra.includes('i') ||
      this.extra.includes('w');
    if (hasRiichi && this.uraDora.length > 0) {
      let uraDora = 0;
      for (const v of this.hai) {
        for (const vv of this.uraDora) {
          if (v === vv) uraDora++;
        }
      }
      for (let v of this.furo) {
        if (v.length === 2) v = v.concat(v);
        for (const vv of v) {
          for (const vvv of this.uraDora) {
            if (vvv === vv) uraDora++;
          }
        }
      }
      if (uraDora) {
        this.tmpResult.han += uraDora;
        this.tmpResult.yaku.push({
          name: '裏ドラ',
          value: { type: 'han', count: uraDora },
        });
      }
    }

    if (this.allowAka && this.aka) {
      this.tmpResult.han += this.aka;
      this.tmpResult.yaku.push({
        name: '赤ドラ',
        value: { type: 'han', count: this.aka },
      });
    }
  }

  /**
   * 符計算
   */
  calcFu() {
    let fu = 0;
    const hasChiitoi = this.tmpResult.yaku.some((y) => y.name === '七対子');
    const hasPinfu = this.tmpResult.yaku.some((y) => y.name === '平和');
    if (hasChiitoi) {
      fu = 25;
    } else if (hasPinfu) {
      fu = this.isTsumo ? 20 : 30;
    } else {
      fu = 20;
      let hasAgariFu = false;
      if (!this.isTsumo && this.isMenzen()) fu += 10;
      for (const v of this.currentPattern) {
        if (typeof v === 'string') {
          if (v.includes('z'))
            for (const vv of [this.bakaze, this.jikaze, 5, 6, 7])
              if (parseInt(v) === vv) fu += 2;
          if (this.agari === v) hasAgariFu = true;
        } else {
          if (v.length === 4) fu += is19(v[0]) ? 16 : 8;
          else if (v.length === 2) fu += is19(v[0]) ? 32 : 16;
          else if (v.length === 1) fu += is19(v[0]) ? 8 : 4;
          else if (v.length === 3 && v[0] === v[1]) fu += is19(v[0]) ? 4 : 2;
          else if (!hasAgariFu) {
            if (v[1] === this.agari) hasAgariFu = true;
            else if (v[0] === this.agari && parseInt(v[2]) === 9)
              hasAgariFu = true;
            else if (v[2] === this.agari && parseInt(v[0]) === 1)
              hasAgariFu = true;
          }
        }
      }

      if (hasAgariFu) fu += 2;
      if (this.isTsumo) fu += 2;

      fu = ceil10(fu);
      if (fu < 30) fu = 30;
    }
    this.tmpResult.fu = fu;
  }

  /**
   * 点数計算
   */
  calcTen() {
    this.tmpResult.name = '';
    let base;

    // scoreInfoの設定
    this.tmpResult.scoreInfo = {
      bakaze: numberToKaze(this.bakaze),
      jikaze: numberToKaze(this.jikaze),
      agariType: this.isTsumo ? 'tsumo' : 'ron',
    };

    if (this.tmpResult.yakuman) {
      base = 8000 * this.tmpResult.yakuman;
      if (this.tmpResult.yakuman === 1) {
        this.tmpResult.name = '役満';
      } else if (this.tmpResult.yakuman === 2) {
        this.tmpResult.name = '2倍役満';
      } else if (this.tmpResult.yakuman === 3) {
        this.tmpResult.name = '3倍役満';
      } else if (this.tmpResult.yakuman === 4) {
        this.tmpResult.name = '4倍役満';
      } else if (this.tmpResult.yakuman === 5) {
        this.tmpResult.name = '5倍役満';
      } else {
        this.tmpResult.name = '6倍役満';
      }
    } else {
      if (!this.tmpResult.han) return;
      base = this.tmpResult.fu * Math.pow(2, this.tmpResult.han + 2);
      if (base > 2000) {
        if (this.tmpResult.han >= 13) {
          base = 8000;
          this.tmpResult.name = '数え役満';
        } else if (this.tmpResult.han >= 11) {
          base = 6000;
          this.tmpResult.name = '三倍満';
        } else if (this.tmpResult.han >= 8) {
          base = 4000;
          this.tmpResult.name = '倍満';
        } else if (this.tmpResult.han >= 6) {
          base = 3000;
          this.tmpResult.name = '跳満';
        } else {
          base = 2000;
          this.tmpResult.name = '満貫';
        }
      }
    }

    // paymentの設定
    if (this.isTsumo) {
      if (this.isOya) {
        // 親のツモ: 子全員から同額
        const fromKo = ceil100(base * 2);
        this.tmpResult.payment = {
          type: 'tsumo',
          fromOya: fromKo,
          fromKo: fromKo,
        };
        this.tmpResult.ten = fromKo * 3;
      } else {
        // 子のツモ: 親と子で異なる額
        const fromOya = ceil100(base * 2);
        const fromKo = ceil100(base);
        this.tmpResult.payment = {
          type: 'tsumo',
          fromOya: fromOya,
          fromKo: fromKo,
        };
        this.tmpResult.ten = fromOya + fromKo * 2;
      }
    } else {
      // ロン
      const amount = this.isOya ? ceil100(base * 6) : ceil100(base * 4);
      this.tmpResult.payment = {
        type: 'ron',
        amount: amount,
      };
      this.tmpResult.ten = amount;
    }
  }

  /**
   * 手役計算
   */
  calcYaku() {
    this.tmpResult.yaku = [];
    this.tmpResult.yakuman = 0;
    this.tmpResult.han = 0;
    for (const k in YAKU) {
      const v = YAKU[k];
      if (this.disabled.includes(k)) continue;
      if (v.isLocal && !this.allLocalEnabled && !this.localEnabled.includes(k))
        continue;
      if (this.tmpResult.yakuman && !v.yakuman) continue;
      if (v.isMenzenOnly && !this.isMenzen()) continue;
      if (v.check(this)) {
        if (v.yakuman) {
          const n = this.allowWyakuman ? v.yakuman : 1;
          this.tmpResult.yakuman += n;
          this.tmpResult.yaku.push({
            name: k as YakuName,
            value: { type: 'yakuman', multiplier: n as 1 | 2 },
          });
        } else {
          let n = v.han!;
          if (v.isFuroMinus && !this.isMenzen()) n--;
          this.tmpResult.yaku.push({
            name: k as YakuName,
            value: { type: 'han', count: n },
          });
          this.tmpResult.han += n;
        }
      }
    }
  }

  // api exports ↓ ----------------------------------------------------------------------------------------------------

  disableWyakuman() {
    //二倍役満禁止
    this.allowWyakuman = false;
  }
  disableKuitan() {
    //喰断禁止
    this.allowKuitan = false;
  }
  disableAka() {
    //赤dora禁止
    this.allowAka = false;
  }
  enableLocalYaku(name: '大七星' | '人和') {
    //指定local役有効
    this.localEnabled.push(name);
  }
  disableYaku(name: string) {
    //指定役禁止
    this.disabled.push(name);
  }

  // supported local yaku list
  // 大七星 役満(字一色別)
  // 人和 役満
  //

  disableHairi() {
    this.hairi = false;
  }

  /**
   * main
   */
  calc() {
    if (this.tmpResult.error) {
      return this.tmpResult;
    }
    this.tmpResult.isAgari = checkAll(this.haiArray);
    if (
      !this.tmpResult.isAgari ||
      this.hai.length + this.furo.length * 3 !== 14
    ) {
      if (this.hairi) {
        this.tmpResult.hairi = hairi(this.haiArray);
        this.tmpResult.hairi7and13 = hairi(this.haiArray, true);
      }
      return this.tmpResult;
    }

    this.finalResult.isAgari = true;
    if (this.extra.includes('o')) this.allLocalEnabled = true;

    this.agariPatterns = findAllAgariPatterns(this.haiArray);
    if (!this.agariPatterns.length) this.agariPatterns.push([]);
    for (const v of this.agariPatterns) {
      if (!this.isTsumo) {
        for (let k = 0; k < v.length; k++) {
          const vv = v[k];
          if (Array.isArray(vv) && vv.length === 1 && vv[0] === this.agari) {
            const i = MPSZ.indexOf(this.agari[1]);
            if (this.haiArray[i][parseInt(this.agari) - 1] < 4)
              v[k] = [vv[0], vv[0], vv[0]];
          }
        }
      }
      this.currentPattern = v.concat(this.furo);
      this.calcYaku();
      if (!this.tmpResult.yakuman && !this.tmpResult.han) continue;
      if (this.tmpResult.han) {
        this.calcDora();
        this.calcFu();
      }
      this.calcTen();
      if (this.tmpResult.ten > this.finalResult.ten)
        this.finalResult = JSON.parse(
          JSON.stringify(this.tmpResult),
        ) as RiichiCalcResult;
      else if (
        this.tmpResult.ten === this.finalResult.ten &&
        this.tmpResult.han > this.finalResult.han
      )
        this.finalResult = JSON.parse(
          JSON.stringify(this.tmpResult),
        ) as RiichiCalcResult;
    }

    return this.finalResult;
  }
}

export { Riichi };
