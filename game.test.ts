import { game, makeInitialState, type GameAction } from './game';

jest.mock('./config', () => ({
  MIN: 1,
  MAX: 100,
  MAX_ATTEMPTS: 5,
  MAX_DUMB_ATTEMPTS: 3,
}));

jest.mock('./utils', () => ({
  draw: () => 10,
}));

const applyActions = (actions: GameAction[]) =>
  actions.reduce((acc, curr) => game(acc, curr), makeInitialState());

describe('game', () => {
  it('should initialize state', () => {
    const s = makeInitialState();

    expect(game(s, { type: 'noop' })).toBe(s);
  });

  it('should handle a correct answer', () => {
    const { type, msg } = applyActions([
      {
        type: 'input',
        value: 10,
      },
    ]);

    expect(type).toBe('game_over');
    expect(msg).toMatchInlineSnapshot(`"You win"`);
  });

  it('should give hints when given a smaller number', () => {
    const { type, msg } = applyActions([
      {
        type: 'input',
        value: 1,
      },
    ]);

    expect(type).toBe('playing');
    expect(msg).toMatchInlineSnapshot(
      `"Try again (a greater number this time):"`,
    );
  });

  it('should give hints when given a greater number', () => {
    const { type, msg } = applyActions([
      {
        type: 'input',
        value: 20,
      },
    ]);

    expect(type).toBe('playing');
    expect(msg).toMatchInlineSnapshot(
      `"Try again (a smaller number this time):"`,
    );
  });

  it('should signal following a hint', () => {
    const { type, msg } = applyActions([
      { type: 'input', value: 1 },
      { type: 'input', value: 2 },
    ]);

    expect(type).toBe('playing');
    expect(msg).toMatchInlineSnapshot(
      `"Nice try. Try again (a greater number this time):"`,
    );
  });

  it('should signal repeating the previous attempt', () => {
    const { type, msg } = applyActions([
      { type: 'input', value: 1 },
      { type: 'input', value: 1 },
    ]);

    expect(type).toBe('playing');
    expect(msg).toMatchInlineSnapshot(
      `"Dumb! Try again (a greater number this time):"`,
    );
  });

  it('should signal repeating any previous attempt', () => {
    const { type, msg } = applyActions([
      { type: 'input', value: 1 },
      { type: 'input', value: 2 },
      { type: 'input', value: 1 },
    ]);

    expect(type).toBe('playing');
    expect(msg).toMatchInlineSnapshot(
      `"Dumb! Try again (a greater number this time):"`,
    );
  });

  it('should signal ignoring a hint (greater)', () => {
    const { type, msg } = applyActions([
      { type: 'input', value: 2 },
      { type: 'input', value: 1 },
    ]);

    expect(type).toBe('playing');
    expect(msg).toMatchInlineSnapshot(
      `"Dumb! Try again (a greater number this time):"`,
    );
  });

  it('should signal ignoring a hint (smaller)', () => {
    const { type, msg } = applyActions([
      { type: 'input', value: 20 },
      { type: 'input', value: 21 },
    ]);

    expect(type).toBe('playing');
    expect(msg).toMatchInlineSnapshot(
      `"Dumb! Try again (a smaller number this time):"`,
    );
  });

  it('should respect the maximum number of attempts', () => {
    const { type, msg } = applyActions([
      { type: 'input', value: 1 },
      { type: 'input', value: 2 },
      { type: 'input', value: 3 },
      { type: 'input', value: 4 },
      { type: 'input', value: 5 },
    ]);

    expect(type).toBe('game_over');
    expect(msg).toMatchInlineSnapshot(`"You lose"`);
  });

  it('should respect the maximum number of dumb attempts', () => {
    const { type, msg } = applyActions([
      { type: 'input', value: 4 },
      { type: 'input', value: 3 },
      { type: 'input', value: 2 },
      { type: 'input', value: 1 },
    ]);

    expect(type).toBe('game_over');
    expect(msg).toMatchInlineSnapshot(`"This isn't working"`);
  });
});
