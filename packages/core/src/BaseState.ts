import { Event } from '@mjai/types';

export interface BaseState<T> {
  handle(event: Event): void;
  get(): T;
}
