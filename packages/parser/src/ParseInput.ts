import { Event } from '@mjai/types';

import { MjaiLogInputSchema } from './input/MjaiLog';

export const ParseInput = (input: unknown): Event[] =>
  MjaiLogInputSchema.parse(input);
