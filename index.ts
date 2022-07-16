import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const MIN = 1;
const MAX = 10;
const WINNING_NUMBER = 8;

rl.question(`Guess a number between ${MIN} and ${MAX}:\n`, (res) => {
  const num = parseInt(res, 10);

  rl.write(`You ${num === WINNING_NUMBER ? "win :)" : "lose :("}\n`);
  rl.close();
});
