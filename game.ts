import { draw } from './utils';

export const MIN = 1;
export const MAX = 100;
export const MAX_ATTEMPTS = 5;

const $$winningNumber: unique symbol = Symbol('$$winningNumber');
type $$winningNumber = typeof $$winningNumber;

const $$attempts: unique symbol = Symbol('$$attempts');
type $$attempts = typeof $$attempts;

const $$prev: unique symbol = Symbol('$$prev');
type $$prev = typeof $$prev;

type InternalGameState = {
  [$$winningNumber]: number;
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

      if (attempts < MAX_ATTEMPTS) {
        const dumb = state[$$prev].includes(action.value);

        const hint =
          action.value > state[$$winningNumber] ? 'smaller' : 'greater';

        const msg = `${
          dumb ? 'Dumb! ' : ''
        }Try again (a ${hint} number this time):`;

        return {
          ...state,
          type: 'playing',
          msg,
          [$$attempts]: attempts,
          [$$prev]: [...state[$$prev], action.value],
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
