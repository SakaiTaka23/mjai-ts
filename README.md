# mjai-ts

A TypeScript implementation of mahjong game log parser and core logic library.

## Features

- **Parse mahjong game logs (mjai format)** - Convert JSON-format game logs with validation
- **Type definitions** - Comprehensive TypeScript types for all game events and states
- **Game state management** - Track game state including hands (tehai), discards (kawa), dora, and scores
- **Score calculation** - Calculate han, fu, and points for winning hands with yaku detection
- **Validation** - Input validation using Zod schemas

Score calculation is inspired by [takayama-lily/riichi](https://github.com/takayama-lily/riichi).

## Project Structure

This is a single package with the following internal modules:

- **types** - Type definitions for game events and tiles
- **parser** - Game log parser with Zod validation
- **core** - Core mahjong logic including state management and score calculation

## Installation

```bash
npm install mjai-ts
```

## Usage

### Parsing Game Logs

```typescript
import { ParseInput } from 'mjai-ts';

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

Use `ParseInputSafe` for safe parsing that returns a result object instead of throwing errors.

### Game State Management

```typescript
import { createGameState } from 'mjai-ts';

// Initialize game state
const gameState = createGameState();

// Process game events
gameState.handle(event);

// Access state
const tehai = gameState.tehai.get(); // Player hands
const kawa = gameState.kawa.get(); // Discarded tiles
const dora = gameState.dora.get(); // Dora indicators
const score = gameState.score.get(); // Player scores
const kyoku = gameState.kyoku.get(); // Round information
```

### Score Calculation

```typescript
import { Riichi, createRiichiFromParams, createRiichiFromState } from 'mjai-ts';

// Method 1: Create directly from game state (Recommended)
const gameState = createGameState();
// ... process game events ...
const riichi = createRiichiFromState(gameState, 0); // player ID

// Method 2: Using detailed parameters
const riichi = createRiichiFromParams(
  [
    '1m',
    '1m',
    '2m',
    '2m',
    '3m',
    '3m',
    '4m',
    '5m',
    '6m',
    '7m',
    '8m',
    '9m',
    '1s',
  ], // tehai
  [], // fuuro
  '1s', // hora tile
  false, // isRon (false = tsumo)
  ['1s', '2s'], // dora
  [], // uraDora
  false, // isTenchiho
  false, // isDoubleReach
  false, // isIpatsu
  false, // isReach
  false, // isHaiteiHotei
  false, // isChankanRinshan
  'E', // bakaze (round wind)
  'S', // jikaze (seat wind)
);

// Method 3: Using string notation (simple and concise)
const riichi = new Riichi('112233456789m11s');
console.log(riichi.calc());
```

Output:

```typescript
{
  isAgari: true,
  yakuman: 0,
  yaku: [
    {
      name: "一気通貫",
      value: {
        type: "han",
        count: 2,
      },
    },
    {
      name: "一盃口",
      value: {
        type: "han",
        count: 1,
      },
    },
    {
      name: "門前清自摸和",
      value: {
        type: "han",
        count: 1,
      },
    },
  ],
  han: 4,
  fu: 30,
  ten: 7900,
  name: "",
  scoreInfo: {
    bakaze: "E",
    jikaze: "S",
    agariType: "tsumo",
  },
  payment: {
    type: "tsumo",
    fromOya: 3900,
    fromKo: 2000,
  },
  error: false,
}
```

#### Tile Notation

- `m`, `p`, `s`, `z` represent 萬子 (manzu), 筒子 (pinzu), 索子 (souzu), 字牌 (jihai)
- `1z-7z` represent 東南西北白發中 (East, South, West, North, White, Green, Red)
- `0m`, `0p`, `0s` represent red fives (赤5)

#### Tsumo vs Ron

```typescript
new Riichi('112233456789m1s1s'); // Tsumo (self-draw)
new Riichi('112233456789m1s+1s'); // Ron (winning on discard)
```

#### Calls (Fuuro)

```typescript
// 123m = chi, 55z = ankan, 666z = pon, 7777z = daiminkan, kakan
// These string must only contain the suit on the end of the fuuro -> 1m2m3m is invalid
// For chi the number must be sorted and also treat red 5 as 5 -> 132m is invalid, 046m is invalid must be 405m
new Riichi('1s+1s+123m55z666z7777z');
```

#### Dora

```typescript
new Riichi('112233456789m1s1s+d12s'); // Dora: 1s, 2s
new Riichi('112233456789m1s1s+r+u1s'); // Ura-dora: 1s (requires riichi)
```

#### Extra Options

```typescript
new Riichi('1s+1s+123m55z666z7777z+d12s+u1s+trihk22');
```

Dora and Ura-dora must be specified separately in the options.

| Option | Meaning                                          |
| ------ | ------------------------------------------------ |
| `t`    | 天和/地和/人和 (Tenhou/Chiihou/Renhou)           |
| `r(l)` | 立直 (Riichi)                                    |
| `i(y)` | 一発 (Ippatsu)                                   |
| `w`    | W立直 (Double Riichi)                            |
| `h`    | 海底摸月/河底撈魚 (Haitei/Houtei)                |
| `k`    | 槍槓/嶺上開花 (Chankan/Rinshan)                  |
| `o`    | 全local役有効 (Enable all local yaku)            |
| `22`   | 場風南自風南 (Round wind South, seat wind South) |

#### Wind Configuration

1234 = 東南西北 (East, South, West, North)
Default: Round wind = East, Seat wind = South

```typescript
new Riichi('112233456789m1s1s+1'); // Seat wind = East (round wind = East)
new Riichi('112233456789m1s1s+21'); // Round wind = South, seat wind = East
new Riichi('112233456789m1s1s+24'); // Round wind = South, seat wind = North
```

### Yaku Helper Functions

```typescript
import {
  toStringYakuName,
  hasYaku,
  getYaku,
  calculateTotalHan,
  formatYakuValue,
  parseYakuString,
  paymentToArrays,
} from 'mjai-ts';

const result = riichi.calc();

// Check if a specific yaku is present
if (hasYaku(result, '一気通貫')) {
  console.log('Ittsuu detected!');
}

// Get a specific yaku
const yakuEntry = getYaku(result, '一気通貫');

// Calculate total han
const totalHan = calculateTotalHan(result);

// Format yaku value for display
const formatted = formatYakuValue(yakuEntry.value);

// Convert payment object to arrays
const [oya, ko] = paymentToArrays(result.payment);
```

## API Reference

### Parser

- `ParseInput(input)` - Parse and validate mjai format logs (throws on error)
- `ParseInputSafe(input)` - Safe parse that returns result object with success/error status

### State Management

- `createGameState()` - Create a new game state manager with methods:
  - `gameState.handle(event)` - Process game events
  - `gameState.tehai.get()` - Get player hands
  - `gameState.kawa.get()` - Get discarded tiles
  - `gameState.dora.get()` - Get dora indicators
  - `gameState.score.get()` - Get player scores
  - `gameState.kyoku.get()` - Get round information

### Score Calculation

- `Riichi` - Score calculation class
  - `new Riichi(notation: string)` - Create from string notation
  - `.calc()` - Calculate score and return result with yaku, han, fu, and payment

- `createRiichiFromParams(...)` - Create Riichi instance from detailed parameters:
  - `tehai: Tile[]` - Hand tiles
  - `fuuro: Fuuro[]` - Called tiles (chi, pon, kan)
  - `horaTile: Tile | null` - Winning tile
  - `isRon: boolean` - True if ron, false if tsumo
  - `dora: Tile[]` - Dora indicators
  - `uraDora: Tile[]` - Ura-dora indicators
  - `isTenchiho: boolean` - Tenhou/Chiihou
  - `isDoubleReach: boolean` - Double riichi
  - `isIpatsu: boolean` - Ippatsu
  - `isReach: boolean` - Riichi
  - `isHaiteiHotei: boolean` - Haitei/Houtei
  - `isChankanRinshan: boolean` - Chankan/Rinshan
  - `bakaze: Wind` - Round wind
  - `jikaze: Wind` - Seat wind

- `createRiichiFromState(state, playerID)` - Create Riichi instance from GameState
  - Automatically extracts all necessary information from game state
  - Most convenient when using state management

### Yaku Helpers

- `toStringYakuName(name)` - Convert yaku name to string
- `hasYaku(result, name)` - Check if result contains specific yaku
- `getYaku(result, name)` - Get specific yaku entry from result
- `calculateTotalHan(result)` - Calculate total han including yakuman
- `formatYakuValue(value)` - Format yaku value for display
- `parseYakuString(str)` - Parse yaku from string
- `paymentToArrays(payment)` - Convert payment object to arrays [oya, ko]

### Types

All TypeScript types for game events, tiles, states, and calculation results are exported from the main package.
