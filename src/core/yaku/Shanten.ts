import { HaiArr } from './YakuTypes';

/*
 * @Copyright https://github.com/takayama-lily/syanten
 */
const sum = (arr: number[]) => {
  let s = 0;
  for (const value of arr) {
    s += value;
  }
  return s;
};
const syanten = (hai_arr: HaiArr) => {
  let res = 9;
  let mentsu = 0;
  let tatsu = 0;
  let alone = 0;
  let furo = 0;
  const search = (arr: number[], is_jihai = false) => {
    const searchHelper = (
      arr: number[],
      index: number,
      is_jihai = false,
      mentsu: number,
      tatsu: number,
      alone: number,
    ) => {
      let tmp = [0, 0, 0];
      let max = [mentsu, tatsu, alone];
      if (index === (is_jihai ? 7 : 9)) {
        return max;
      }
      if (arr[index] === 0) {
        tmp = searchHelper(arr, index + 1, is_jihai, mentsu, tatsu, alone);
        if (tmp > max) {
          max = tmp;
        }
      }
      if (arr[index] >= 3) {
        arr[index] -= 3;
        tmp = searchHelper(arr, index, is_jihai, mentsu + 1, tatsu, alone);
        if (tmp > max) {
          max = tmp;
        }
        arr[index] += 3;
      }
      if (arr[index] >= 2) {
        arr[index] -= 2;
        tmp = searchHelper(arr, index, is_jihai, mentsu, tatsu + 1, alone);
        if (tmp > max) {
          max = tmp;
        }
        arr[index] += 2;
      }
      if (arr[index] >= 1) {
        arr[index] -= 1;
        tmp = searchHelper(arr, index, is_jihai, mentsu, tatsu, alone + 1);
        if (tmp > max) {
          max = tmp;
        }
        arr[index] += 1;
      }
      if (!is_jihai) {
        if (arr[index] > 0 && arr[index + 1] > 0 && arr[index + 2] > 0) {
          arr[index]--;
          arr[index + 1]--;
          arr[index + 2]--;
          tmp = searchHelper(arr, index, is_jihai, mentsu + 1, tatsu, alone);
          if (tmp > max) {
            max = tmp;
          }
          arr[index]++;
          arr[index + 1]++;
          arr[index + 2]++;
        }
        if (arr[index] > 0 && arr[index + 2] > 0) {
          arr[index]--;
          arr[index + 2]--;
          tmp = searchHelper(arr, index, is_jihai, mentsu, tatsu + 1, alone);
          if (tmp > max) {
            max = tmp;
          }
          arr[index]++;
          arr[index + 2]++;
        }
        if (arr[index] > 0 && arr[index + 1] > 0) {
          arr[index]--;
          arr[index + 1]--;
          tmp = searchHelper(arr, index, is_jihai, mentsu, tatsu + 1, alone);
          if (tmp > max) {
            max = tmp;
          }
          arr[index]++;
          arr[index + 1]++;
        }
      }
      return max;
    };
    const tmp = searchHelper(arr, 0, is_jihai, 0, 0, 0);
    mentsu += tmp[0];
    tatsu += tmp[1];
    alone += tmp[2];
  };
  const calc = () => {
    let tmp_res = -1;
    while (mentsu < 4 - furo) {
      if (tatsu && alone) {
        tatsu--;
        alone--;
        mentsu++;
        tmp_res++;
        continue;
      }
      if (tatsu && !alone) {
        tatsu--;
        alone++;
        mentsu++;
        tmp_res++;
        continue;
      }
      if (!tatsu && alone) {
        alone -= 2;
        mentsu++;
        tmp_res += 2;
      }
    }
    if (alone > 0) tmp_res++;
    res = tmp_res < res ? tmp_res : res;
    mentsu = tatsu = alone = 0;
  };
  hai_arr = [
    [...hai_arr[0]],
    [...hai_arr[1]],
    [...hai_arr[2]],
    [...hai_arr[3]],
  ];
  const arr = [...hai_arr[0], ...hai_arr[1], ...hai_arr[2], ...hai_arr[3]];
  const s = sum(arr);
  if (s > 14 || s % 3 === 0) return -2;
  furo = Math.round((14 - s) / 3);
  if (s % 3 === 1) {
    for (let i = 33; ; i--) {
      if (!arr[i]) {
        arr[i]++;
        hai_arr[Math.floor(i / 9)][i % 9]++;
        break;
      }
    }
  }
  for (let i = 0; i < 34; i++) {
    if (arr[i] === 0) continue;
    const t = [];
    t[0] = [...hai_arr[0]];
    t[1] = [...hai_arr[1]];
    t[2] = [...hai_arr[2]];
    t[3] = [...hai_arr[3]];
    t[Math.floor(i / 9)][i % 9] -= arr[i] >= 2 ? 2 : arr[i];
    search(t[0]);
    search(t[1]);
    search(t[2]);
    search(t[3], true);
    calc();
  }
  return res;
};
const syanten7 = (hai_arr: HaiArr) => {
  const cnt =
    sum(hai_arr[0]) + sum(hai_arr[1]) + sum(hai_arr[2]) + sum(hai_arr[3]);
  if (cnt < 13 || cnt > 14) return -2;
  const arr = [...hai_arr[0], ...hai_arr[1], ...hai_arr[2], ...hai_arr[3]];
  let s = 0,
    t = 0;
  for (let i = 0; i < 34; i++) {
    if (arr[i] >= 2) s++;
    if (arr[i] === 1) t++;
  }
  if (s + t >= 7) return 6 - s;
  else return 6 - s + (7 - s - t);
};
const syanten13 = (hai_arr: HaiArr) => {
  const cnt =
    sum(hai_arr[0]) + sum(hai_arr[1]) + sum(hai_arr[2]) + sum(hai_arr[3]);
  if (cnt < 13 || cnt > 14) return -2;
  const arr = [
    hai_arr[0][0],
    hai_arr[0][8],
    hai_arr[1][0],
    hai_arr[1][8],
    hai_arr[2][0],
    hai_arr[2][8],
    ...hai_arr[3],
  ];
  let s = 0,
    t = 0;
  for (let i = 0; i < 13; i++) {
    if (arr[i]) s++;
    if (arr[i] > 1) t = 1;
  }
  return 13 - s - t;
};
const syantenAll = (hai_arr: HaiArr) => {
  const s7 = syanten7(hai_arr);
  const s13 = syanten13(hai_arr);
  if (s7 === -2 || s13 === -2) return syanten(hai_arr);
  else return Math.min(syanten(hai_arr), s7, s13);
};

const MPSZ = ['m', 'p', 's', 'z'] as const;
const hairi = (hai_arr: HaiArr, is7or13 = false) => {
  const syantenCalc = !is7or13
    ? syanten
    : (haiArr: HaiArr) => {
        return Math.min(syanten7(haiArr), syanten13(haiArr));
      };
  const sht = syantenCalc(hai_arr);
  const res: {
    now: number;
    wait: Map<string, number> | undefined;
    [key: string]: Map<string, number> | number | undefined;
  } = { now: sht, wait: undefined };
  if (sht < 0) return res;
  let self: number[] = [];
  const calcHairi = () => {
    const map = new Map<string, number>();
    for (let i = 0; i < 4; i++) {
      for (let ii = 0; ii < 9; ii++) {
        if (hai_arr[i][ii] === undefined) continue;
        if (i === self[0] && ii === self[1]) continue;
        if (!is7or13 && i == 3 && hai_arr[i][ii] === 0) continue;
        if (
          !is7or13 &&
          i < 3 &&
          hai_arr[i][ii] === 0 &&
          !(hai_arr[i][ii - 1] === 0) &&
          !(hai_arr[i][ii - 2] === 0) &&
          !(hai_arr[i][ii + 1] === 0) &&
          !(hai_arr[i][ii + 1] === 0)
        )
          continue;
        hai_arr[i][ii]++;
        if (syantenCalc(hai_arr) < sht) {
          map.set(ii + 1 + MPSZ[i], 5 - hai_arr[i][ii]);
        }
        hai_arr[i][ii]--;
      }
    }
    return map;
  };
  if (
    (sum(hai_arr[0]) + sum(hai_arr[1]) + sum(hai_arr[2]) + sum(hai_arr[3])) %
      3 ===
    1
  ) {
    res.wait = calcHairi();
    return res;
  }
  for (let i = 0; i < 4; i++) {
    for (let ii = 0; ii < 9; ii++) {
      if (hai_arr[i][ii] === 0 || hai_arr[i][ii] === undefined) continue;
      hai_arr[i][ii]--;
      if (syantenCalc(hai_arr) === sht) {
        self = [i, ii];
        res[ii + 1 + MPSZ[i]] = calcHairi();
      }
      hai_arr[i][ii]++;
    }
  }
  return res;
};

export { syanten, syanten7, syanten13, syantenAll, hairi };
