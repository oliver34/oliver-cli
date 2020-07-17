import { RC, DEFAULTS } from './constants';
import { decode, encode } from 'ini';
import { promisify } from 'util';
import chalk from 'chalk';
import fs from 'fs';

const exits = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const get = async (key) => {
  const exit = await exits(RC);
  let opts;
  if (exit) {
    opts = await readFile(RC, 'utf8');
    opts = decode(opts);
    return key ? opts : opts[key];
  }
  return '';
};

export const set = async (key, value) => {
  const exit = await exits(RC);
  let opts;
  if (exit) {
    opts = await readFile(RC, 'utf8');
    opts = decode(opts);
    if (!key) {
      console.log(
        chalk.red(chalk.bold('Error:')),
        chalk.red('key is required')
      );
      return;
    }

    if (!value) {
      console.log(
        chalk.red(chalk.bold('Error:')),
        chalk.red('value is required')
      );
      return;
    }
    Object.assign(opts, { [key]: value });
  } else {
    opts = Object.assign(DEFAULTS, { [key]: value });
  }
};

const remove = async (key) => {
  const exit = await exits(RC);
  let opts;
  if (exit) {
    opts = await readFile(RC, 'utf8');
    opts = decode(opts);
    delete opts[key];
    await writeFile(RC, encode(opts), 'utf8');
  }
};

export default {
  get,
  set,
  remove,
};
