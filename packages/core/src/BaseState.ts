import { Event } from '@mjai/types';

export interface BaseState {
  handle(event: Event): boolean;
}
