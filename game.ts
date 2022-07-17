import { draw } from './utils';

export const MIN = 1;
export const MAX = 100;
export const MAX_ATTEMPTS = 3;

const $$winningNumber: unique symbol = Symbol('$$winningNumber');
type $$winningNumber = typeof $$winningNumber;

const $$attempts: unique symbol = Symbol('$$attempts');
type $$attempts = typeof $$attempts;

type InternalGameState = {
  [$$winningNumber]: number;
  [$$attempts]: number;
};

export type GameState =
  | ({
      type: 'playing';
      msg: string;
    } & InternalGameState)
  | ({
      type: 'game_over';
      msg: string;
    } & InternalGameState);

export type GameAction =
  | {
      type: 'noop';
    }
  | {
      type: 'input';
      value: number;
    };

export const makeInitialState = (): GameState => ({
  type: 'playing',
  msg: `Guess a number between ${MIN} and ${MAX}:`,
  [$$winningNumber]: draw(MIN, MAX),
  [$$attempts]: 0,
});

export const game = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'input': {
      const attempts = state[$$attempts] + 1;

      if (action.value === state[$$winningNumber])
        return {
          ...state,
          type: 'game_over',
          msg: 'You win',
          [$$attempts]: attempts,
        };

      if (attempts < MAX_ATTEMPTS) {
        const msg = `Try again (a ${
          action.value > state[$$winningNumber] ? 'smaller' : 'greater'
        } number this time):`;

        return {
          ...state,
          type: 'playing',
          msg,
          [$$attempts]: attempts,
        };
      }

      return {
        ...state,
        type: 'game_over',
        msg: 'You lose',
        [$$attempts]: attempts,
      };
    }
    default:
      return state;
  }
};
