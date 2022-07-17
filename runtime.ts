import { game, makeInitialState } from './game';
import { type IO } from './io';

export const runtime = async (io: IO) => {
  await io.open();

  let state = game(makeInitialState(), { type: 'noop' });

  while (state.type === 'playing') {
    state = game(state, {
      type: 'input',
      value: await io.prompt(state.msg),
    });
  }

  await io.write(state.msg);
  await io.close();
};
