import { runtime } from './runtime';
import { makeStdIO } from './io';

(async () => {
  await runtime(makeStdIO());
})();
