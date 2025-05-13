import { Event } from '@mjai/types';

export interface BaseState<T> {
  get(): T;
}

export interface InternalBaseState<T> extends BaseState<T> {
  handle(event: Event): void;
}
