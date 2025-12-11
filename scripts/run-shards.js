#!/usr/bin/env node

/**
 * Script to run Playwright tests with sharding in parallel
 * Usage: node scripts/run-shards.js [number-of-shards]
 * Default: 4 shards
 */

const { spawn } = require('child_process');

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

  shards.push(shardProcess);
}

// Wait for all shards to complete
const shardPromises = shards.map(
  (shard, index) =>
    new Promise((resolve, reject) => {
      shard.on('exit', (code) => {
        if (code === 0) {
          resolve({ shard: index + 1, success: true });
        } else {
          console.error(`Shard ${index + 1} exited with code ${code}`);
          reject({ shard: index + 1, code, success: false });
        }
      });
    })
);

Promise.allSettled(shardPromises)
  .then((results) => {
    const failed = results.filter((r) => r.status === 'rejected');
    const succeeded = results.filter((r) => r.status === 'fulfilled');

    if (failed.length === 0) {
      console.log(`\n✅ All ${numberOfShards} shards completed successfully!`);
      process.exit(0);
    } else {
      console.error(`\n❌ ${failed.length} of ${numberOfShards} shards failed:`);
      failed.forEach((failure) => {
        if (failure.reason) {
          console.error(`  - Shard ${failure.reason.shard}: exit code ${failure.reason.code}`);
        }
      });
      console.log(`✅ ${succeeded.length} shard(s) succeeded`);
      process.exit(1);
    }
  });

