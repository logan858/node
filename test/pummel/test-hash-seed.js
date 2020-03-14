'use strict';

// Check that spawn child doesn't create duplicated entries
const common = require('../common');
const kRepetitions = 2;
const assert = require('assert');
const fixtures = require('../common/fixtures');
const { promisify, debuglog } = require('util');
const debug = debuglog('test');

const { execFile } = require('child_process');
const execFilePromise = promisify(execFile);
const targetScript = fixtures.path('guess-hash-seed.js');

const requiredCallback = common.mustCall((results) => {
  const seeds = results.map((val) => val.stdout.trim());
  debug(`Seeds: ${seeds}`);
  assert.strictEqual(new Set(seeds).size, seeds.length);
  assert.strictEqual(seeds.length, kRepetitions);
});

const generateSeed = () => execFilePromise(process.execPath, [targetScript]);
const subprocesses = [...new Array(kRepetitions)].map(generateSeed);

Promise.all(subprocesses)
  .then(requiredCallback);
