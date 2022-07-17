import readline from 'readline';

export type IO = {
  open: () => Promise<void>;
  prompt: (msg: string) => Promise<number>;
  write: (msg: string) => Promise<void>;
  close: () => Promise<void>;
};

export const makeStdIO = (): IO => {
  const io = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return {
    async open() {},

    async close() {
      io.close();
    },

    prompt(msg: string) {
      return new Promise(res => {
        io.question(`${msg}\n`, (input: string) => {
          const num = parseInt(input, 10);
          if (Number.isNaN(num)) throw new Error('Not a number');
          res(num);
        });
      });
    },

    async write(msg: string) {
      io.write(`${msg}\n`);
    },
  };
};
