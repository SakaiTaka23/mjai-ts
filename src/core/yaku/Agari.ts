/*
 * @Copyright https://github.com/takayama-lily/agari
 */

import { HaiArr } from './YakuTypes';

const MPSZ = ['m', 'p', 's', 'z'];

const sum = (arr: number[]): number => {
  let s = 0;
  for (const val of arr) s += val;
  return s;
};

const check7 = (hai_arr: HaiArr): boolean => {
  const arr = [...hai_arr[0], ...hai_arr[1], ...hai_arr[2], ...hai_arr[3]];
  let s = 0;
  for (const val of arr) {
    if (val && val != 2) return false;
    s += val;
  }
  return s == 14;
};

const check13 = (hai_arr: HaiArr): boolean => {
  const arr = [
    hai_arr[0][0],
    hai_arr[0][8],
    hai_arr[1][0],
    hai_arr[1][8],
    hai_arr[2][0],
    hai_arr[2][8],
    ...hai_arr[3],
  ];
  return !arr.includes(0) && sum(arr) == 14;
};

const _check = (arr: number[], is_jihai = false): boolean => {
  arr = [...arr];
  const s = sum(arr);
  if (s === 0) return true;
  if (s % 3 == 2) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] >= 2) arr[i] -= 2;
      else continue;
      if (!_check(arr, is_jihai)) arr[i] += 2;
      else return true;
    }
    return false;
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 0) {
      continue;
    } else if (arr[i] === 3) {
      arr[i] = 0;
      continue;
    } else {
      if (is_jihai || i >= 7) return false;
      if (arr[i] === 4) arr[i] -= 3;
      arr[i + 1] -= arr[i];
      arr[i + 2] -= arr[i];
      if (arr[i + 1] < 0 || arr[i + 2] < 0) return false;
      arr[i] = 0;
    }
  }
  return true;
};

const check = (hai_arr: HaiArr): boolean => {
  let j = 0;
  for (const arr of hai_arr) {
    if (sum(arr) % 3 === 1) return false;
    j += sum(arr) % 3 === 2 ? 1 : 0;
  }
  return (
    j === 1 &&
    _check(hai_arr[3], true) &&
    _check(hai_arr[0]) &&
    _check(hai_arr[1]) &&
    _check(hai_arr[2])
  );
};

const checkAll = (hai_arr: HaiArr): boolean => {
  return check7(hai_arr) || check13(hai_arr) || check(hai_arr);
};

const sumAll = (hai_arr: HaiArr): number => {
  let s = 0;
  for (const arr of hai_arr) s += sum(arr);
  return s;
};

const findKotsu = (hai_arr: HaiArr): string[][] => {
  const res: string[][] = [];
  for (let i = 0; i < hai_arr.length; i++) {
    for (let ii = 0; ii < hai_arr[i].length; ii++) {
      if (hai_arr[i][ii] >= 3) {
        hai_arr[i][ii] -= 3;
        if (check(hai_arr)) {
          res.push([ii + 1 + MPSZ[i]]);
        } else {
          hai_arr[i][ii] += 3;
        }
      }
    }
  }
  return res;
};

const findJyuntsu = (hai_arr: HaiArr): string[][] => {
  const res: string[][] = [];
  for (let i = 0; i < hai_arr.length; i++) {
    if (i === 3) break;
    for (let ii = 0; ii < hai_arr[i].length; ii++) {
      while (
        hai_arr[i][ii] >= 1 &&
        hai_arr[i][ii + 1] >= 1 &&
        hai_arr[i][ii + 2] >= 1
      ) {
        hai_arr[i][ii]--;
        hai_arr[i][ii + 1]--;
        hai_arr[i][ii + 2]--;
        if (check(hai_arr)) {
          res.push([ii + 1 + MPSZ[i], ii + 2 + MPSZ[i], ii + 3 + MPSZ[i]]);
        } else {
          hai_arr[i][ii]++;
          hai_arr[i][ii + 1]++;
          hai_arr[i][ii + 2]++;
          break;
        }
      }
    }
  }
  return res;
};

const findJyanto = (hai_arr: HaiArr): string => {
  for (let i = 0; i < hai_arr.length; i++) {
    for (let ii = 0; ii < hai_arr[i].length; ii++) {
      if (hai_arr[i][ii] >= 2) {
        return ii + 1 + MPSZ[i];
      }
    }
  }
  return '';
};

const findAllAgariPatterns = (hai_arr: HaiArr): (string | string[])[][] => {
  hai_arr = [
    [...hai_arr[0]],
    [...hai_arr[1]],
    [...hai_arr[2]],
    [...hai_arr[3]],
  ];
  const res: (string | string[])[][] = [];

  const calc = (hai_arr: HaiArr, j: string): void => {
    let tmp_hai_arr: HaiArr = [
      [...hai_arr[0]],
      [...hai_arr[1]],
      [...hai_arr[2]],
      [...hai_arr[3]],
    ];
    let first_res = findKotsu(tmp_hai_arr).concat([j]);
    if (sumAll(tmp_hai_arr) === 2) {
      res.push(first_res.sort());
    } else if (first_res.length > 0) {
      first_res = first_res.concat(findJyuntsu(tmp_hai_arr));
      res.push(first_res.sort());
    }
    tmp_hai_arr = [
      [...hai_arr[0]],
      [...hai_arr[1]],
      [...hai_arr[2]],
      [...hai_arr[3]],
    ];
    let second_res = findJyuntsu(tmp_hai_arr).concat([j]);
    if (sumAll(tmp_hai_arr) === 2) {
      res.push(second_res.sort());
    } else {
      second_res = second_res.concat(findKotsu(tmp_hai_arr));
      res.push(second_res.sort());
    }
  };
  if (!check(hai_arr)) {
    return res;
  }
  if (sumAll(hai_arr) === 2) {
    res.push([findJyanto(hai_arr)]);
    return res;
  }
  let j: number;
  for (let i = 0; i < hai_arr[3].length; i++) {
    if (hai_arr[3][i] === 0) {
      hai_arr[3][i] += 2;
      j = i;
      break;
    }
  }
  for (let i = 0; i < hai_arr.length; i++) {
    for (let ii = 0; ii < hai_arr[i].length; ii++) {
      if (i === 3 && ii === j!) continue;
      if (hai_arr[i][ii] >= 2) {
        hai_arr[i][ii] -= 2;
        if (check(hai_arr)) calc(hai_arr, ii + 1 + MPSZ[i]);
        hai_arr[i][ii] += 2;
      }
    }
  }
  const final_res: (string | string[])[][] = [];
  for (const v of res) {
    let is_duplicate = false;
    for (const vv of final_res) {
      if (JSON.stringify(v) === JSON.stringify(vv)) is_duplicate = true;
    }
    if (!is_duplicate) final_res.push(v);
  }
  return final_res;
};

export { check, check7, check13, checkAll, findAllAgariPatterns };
