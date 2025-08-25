import { Event } from '@mjai/types';
import { ZodSafeParseResult } from 'zod';

import { MjaiLogInputSchema } from './input/MjaiLog';

export const ParseInput = (input: unknown): Event[] =>
  MjaiLogInputSchema.parse(input);

export const ParseInputSafe = (input: unknown): ZodSafeParseResult<Event[]> =>
  MjaiLogInputSchema.safeParse(input);
