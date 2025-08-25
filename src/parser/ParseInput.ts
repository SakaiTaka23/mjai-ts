import { ZodSafeParseResult } from 'zod';

import { Event } from '@types';

import { MjaiLogInputSchema } from './input/MjaiLog';

export const ParseInput = (input: unknown): Event[] =>
  MjaiLogInputSchema.parse(input);

export const ParseInputSafe = (input: unknown): ZodSafeParseResult<Event[]> =>
  MjaiLogInputSchema.safeParse(input);
