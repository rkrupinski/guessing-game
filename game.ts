import { draw } from './utils';
import { MIN, MAX, MAX_ATTEMPTS, MAX_DUMB_ATTEMPTS } from './config';

const $$winningNumber: unique symbol = Symbol('$$winningNumber');
type $$winningNumber = typeof $$winningNumber;

const $$dumbAttempts: unique symbol = Symbol('$$dumbAttempts');
type $$dumbAttempts = typeof $$dumbAttempts;

const $$attempts: unique symbol = Symbol('$$attempts');
type $$attempts = typeof $$attempts;

const $$prev: unique symbol = Symbol('$$prev');
type $$prev = typeof $$prev;

type InternalGameState = {
  [$$winningNumber]: number;
  [$$dumbAttempts]: number;
  [$$attempts]: number;
  [$$prev]: number[];
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
  [$$dumbAttempts]: 0,
  [$$attempts]: 0,
  [$$prev]: [],
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
        };

      const prev = state[$$prev].length
        ? state[$$prev][state[$$prev].length - 1]
        : null;

      const repeated = state[$$prev].includes(action.value);

      const hintIgnored =
        typeof prev === 'number' &&
        ((action.value < prev && action.value < state[$$winningNumber]) ||
          (action.value > prev && action.value > state[$$winningNumber]));

      const isDumbAttempt = repeated || hintIgnored;

      const dumpAttempts = state[$$dumbAttempts] + 1;

      if (dumpAttempts === MAX_DUMB_ATTEMPTS)
        return {
          ...state,
          type: 'game_over',
          msg: "This isn't working",
        };

      if (attempts < MAX_ATTEMPTS) {
        const hint =
          action.value > state[$$winningNumber] ? 'smaller' : 'greater';

        const msg = `${
          isDumbAttempt ? 'Dumb! ' : ''
        }Try again (a ${hint} number this time):`;

        return {
          ...state,
          type: 'playing',
          msg,
          [$$attempts]: attempts,
          [$$prev]: [...state[$$prev], action.value],
          [$$dumbAttempts]: isDumbAttempt
            ? state[$$dumbAttempts] + 1
            : state[$$dumbAttempts],
        };
      }

      return {
        ...state,
        type: 'game_over',
        msg: 'You lose',
      };
    }

    default:
      return state;
  }
};
