import config from '@mjai/eslint-config';

export default [
  ...config,
  {
    ignores: ['dist/**', '**/*.config.*'],
  },
];
