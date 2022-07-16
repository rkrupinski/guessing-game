import readline from "readline";

import { draw } from "./utils";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const MIN = 1;
const MAX = 10;

rl.question(`Guess a number between ${MIN} and ${MAX}:\n`, (res) => {
  const winning = draw(MIN, MAX);
  const num = parseInt(res, 10);

  rl.write(`You ${num === winning ? "win :)" : "lose :("}\n`);
  rl.close();
});
