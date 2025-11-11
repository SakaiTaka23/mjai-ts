import type {
  YakuName,
  YakuValue,
  YakuEntry,
  RiichiCalcResult,
} from './YakuTypes';

export function toStringYakuName(name: YakuName): string {
  return name;
}

export function hasYaku(yaku: YakuEntry[], name: YakuName): boolean {
  return yaku.some((entry) => entry.name === name);
}

export function getYaku(
  yaku: YakuEntry[],
  name: YakuName,
): YakuValue | undefined {
  return yaku.find((entry) => entry.name === name)?.value;
}

export function calculateTotalHan(yaku: YakuEntry[]): number {
  return yaku.reduce((total, entry) => {
    if (entry.value.type === 'han') {
      return total + entry.value.count;
    }
    return total;
  }, 0);
}

export function formatYakuValue(value: YakuValue): string {
  if (value.type === 'han') {
    return `${value.count}飜`;
  } else {
    return value.multiplier === 1 ? '役満' : 'ダブル役満';
  }
}

export function parseYakuString(str: string): YakuValue {
  if (str === '役満') {
    return { type: 'yakuman', multiplier: 1 };
  } else if (str === 'ダブル役満') {
    return { type: 'yakuman', multiplier: 2 };
  } else {
    const match = /^(\d+)飜$/.exec(str);
    if (match) {
      return { type: 'han', count: parseInt(match[1], 10) };
    }
    throw new Error(`Unknown yaku string format: ${str}`);
  }
}

export function paymentToArrays(
  payment: RiichiCalcResult['payment'],
  isOya: boolean,
): { oya: number[]; ko: number[] } {
  if (payment.type === 'tsumo') {
    if (isOya) {
      return {
        oya: [payment.fromKo * 3],
        ko: [payment.fromKo, payment.fromKo, payment.fromKo],
      };
    } else {
      return {
        oya: [payment.fromOya + payment.fromKo * 2],
        ko: [payment.fromOya, payment.fromKo, payment.fromKo],
      };
    }
  } else {
    return {
      oya: [payment.amount],
      ko: [payment.amount],
    };
  }
}
