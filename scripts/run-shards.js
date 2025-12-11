#!/usr/bin/env node

/**
 * Script to run Playwright tests with sharding in parallel
 * Usage: node scripts/run-shards.js [number-of-shards]
 * Default: 4 shards
 */

const { spawn } = require('child_process');
const path = require('path');

const numberOfShards = parseInt(process.argv[2]) || 4;
const shards = [];

console.log(`Running tests with ${numberOfShards} shards in parallel...\n`);

// Spawn all shard processes
for (let i = 1; i <= numberOfShards; i++) {
  const shardProcess = spawn('npx', ['playwright', 'test', '--shard', `${i}/${numberOfShards}`], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PW_USE_HEADLESS_NEW: '0', SHARD: i.toString(), TOTAL_SHARDS: numberOfShards.toString() },
  });

  shardProcess.on('error', (error) => {
    console.error(`Shard ${i} error:`, error);
  });

  shardProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Shard ${i} exited with code ${code}`);
      process.exit(code);
    }
  });

  shards.push(shardProcess);
}

// Wait for all shards to complete
Promise.all(
  shards.map(
    (shard) =>
      new Promise((resolve, reject) => {
        shard.on('exit', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Shard exited with code ${code}`));
          }
        });
      })
  )
)
  .then(() => {
    console.log('\n✅ All shards completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Some shards failed:', error);
    process.exit(1);
  });

