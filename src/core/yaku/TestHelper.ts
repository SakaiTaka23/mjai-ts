import { AgariResult, CalcResult, CalcResultType } from './YakuTypes';

export const assertAgariResult: (
  result: CalcResult,
) => asserts result is AgariResult = (result: CalcResult) => {
  if (result.type !== CalcResultType.AGARI) {
    throw new Error(`Expected agari result but got ${result.type}`);
  }
};
