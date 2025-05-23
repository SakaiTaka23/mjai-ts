// Manzu
type Manzu =
  | '1m'
  | '2m'
  | '3m'
  | '4m'
  | '5m'
  | '6m'
  | '7m'
  | '8m'
  | '9m'
  | '5mr';

// Pinzu
type Pinzu =
  | '1p'
  | '2p'
  | '3p'
  | '4p'
  | '5p'
  | '6p'
  | '7p'
  | '8p'
  | '9p'
  | '5pr';

// Souzu
type Souzu =
  | '1s'
  | '2s'
  | '3s'
  | '4s'
  | '5s'
  | '6s'
  | '7s'
  | '8s'
  | '9s'
  | '5sr';

// Wind
type Wind = 'E' | 'S' | 'W' | 'N';

// Dragon
type Dragon = 'P' | 'F' | 'C';

// Special
type Special = '?';

export type Tile = Manzu | Pinzu | Souzu | Wind | Dragon | Special;
