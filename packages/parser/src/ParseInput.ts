import { Event } from '@mjai/types';

import { MjaiLogInput, MjaiLogInputSchema } from './input/MjaiLog';

export const ParseInput = (input: unknown): Event[][] => {
  const parsedInput = MjaiLogInputSchema.parse(input);
  validateInput(parsedInput);

  const groupOutput: Event[][] = [];
  let currentGroup: Event[] = [];
  parsedInput.forEach((event) => {
    if (event.type === 'start_game' || event.type === 'end_game') {
      return;
    }

    if (event.type === 'start_kyoku') {
      if (currentGroup.length > 0) {
        groupOutput.push([...currentGroup]);
      }
      currentGroup = [];
    }
    currentGroup.push(event as Event);
  });

  if (currentGroup.length > 0) {
    groupOutput.push(currentGroup);
  }

  return groupOutput;
};

const validateInput = (input: MjaiLogInput) => {
  if (input[0].type !== 'start_game') {
    throw new Error('Invalid input: first entry must be start_game');
  }
  if (input[input.length - 1].type !== 'end_game') {
    throw new Error('Invalid input: last entry must be end_game');
  }
};
