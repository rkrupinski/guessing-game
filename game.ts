import { draw } from './utils';
import { MIN, MAX, MAX_ATTEMPTS, MAX_DUMB_ATTEMPTS } from './config';

const $$winningNumber: unique symbol = Symbol('$$winningNumber');
type $$winningNumber = typeof $$winningNumber;

const $$dumbAttempts: unique symbol = Symbol('$$dumbAttempts');
type $$dumbAttempts = typeof $$dumbAttempts;

const $$attempts: unique symbol = Symbol('$$attempts');
type $$attempts = typeof $$attempts;

type InternalGameState = {
  [$$winningNumber]: number;
  [$$dumbAttempts]: number;
  [$$attempts]: number[];
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
  [$$attempts]: [],
});

export const game = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'input': {
      if (action.value === state[$$winningNumber])
        return {
          ...state,
          type: 'game_over',
          msg: 'You win',
        };

      const isFirstAttempt = !state[$$attempts].length;

      const prev = state[$$attempts][state[$$attempts].length - 1];

      const repeated = state[$$attempts].includes(action.value);

      const hintIgnored =
        !isFirstAttempt &&
        ((action.value < prev && action.value < state[$$winningNumber]) ||
          (action.value > prev && action.value > state[$$winningNumber]));

      const isDumbAttempt = repeated || hintIgnored;

      const dumbAttempts = isDumbAttempt
        ? state[$$dumbAttempts] + 1
        : state[$$dumbAttempts];

      if (dumbAttempts === MAX_DUMB_ATTEMPTS)
        return {
          ...state,
          type: 'game_over',
          msg: "This isn't working",
        };

      const attempts = [...state[$$attempts], action.value];

      if (attempts.length < MAX_ATTEMPTS) {
        const prefix = isDumbAttempt
          ? 'Dumb! '
          : !isFirstAttempt
          ? 'Nice try. '
          : '';

        const hint =
          action.value > state[$$winningNumber] ? 'smaller' : 'greater';

        const msg = `${prefix}Try again (a ${hint} number this time):`;

        return {
          ...state,
          type: 'playing',
          msg,
          [$$dumbAttempts]: dumbAttempts,
          [$$attempts]: attempts,
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
