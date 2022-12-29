import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { run } from '../src/main';
import * as dotenv from 'dotenv';

describe('valist github action', async function () {
  before(async () => {
    dotenv.config();
    console.log(`   Running with:`);
    console.log(`     Account`, process.env.INPUT_ACCOUNT);
    console.log(`     Project`, process.env.INPUT_PROJECT);
    console.log(`     Release`, process.env.INPUT_RELEASE);
  });

  it('should run without an error', async () => {
    expect(await run());
  });
});