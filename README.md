# mjai-ts
A TypeScript implementation of mahjong game log parser and core logic library.

## Features
- Parse mahjong game logs (mjai format)
- Type definitions for game events
- State management for discards (kawa) and hands (tehai)
- Handle basic mahjong actions like discard and calls

## Project Structure
This project consists of the following packages:
- @mjai/types : Type definitions for game events
- @mjai/parser : Game log parser
- @mjai/core : Core mahjong logic implementation
- @mjai/eslint-config : ESLint configuration
- @mjai/prettier-config : Prettier configuration
- @mjai/tsconfig-config : TypeScript configuration

## Installation

```
npm i mjai-ts
```

## Usage
### Parsing Game Logs
```typescript
import { ParseInput } from '@mjai/parser';

const input = [
  {
    type: 'start_game',
    names: ['Player1', 'Player2', 'Player3', 'Player4'],
    kyoku_first: 0,
    aka_flag: true,
  },
  // ... other game events ...
];

const parsed = ParseInput(input);
```

### Core Logic Examples
```typescript
import { KawaState } from '@mjai/core';

const kawaState = KawaState( /* start condition */ );
const state = kawaState.get();
kawaState.handle( /* event */);
```
