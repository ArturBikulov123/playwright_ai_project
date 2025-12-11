#!/usr/bin/env node

/**
 * Script to run Playwright tests with sharding in parallel
 * Usage: node scripts/run-shards.js [number-of-shards]
 * Default: 4 shards
 */

const { spawn } = require('child_process');

const numberOfShards = parseInt(process.argv[2]) || 4;
const shardPromises = [];

console.log(`Running tests with ${numberOfShards} shards in parallel...\n`);

// Spawn all shard processes and attach exit listeners immediately
for (let i = 1; i <= numberOfShards; i++) {
  // Create promise and attach event listeners immediately to prevent race conditions
  const shardPromise = new Promise((resolve, reject) => {
    const shardProcess = spawn('npx', ['playwright', 'test', '--shard', `${i}/${numberOfShards}`], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, PW_USE_HEADLESS_NEW: '0', SHARD: i.toString(), TOTAL_SHARDS: numberOfShards.toString() },
    });

    // Handle process spawn errors (e.g., command not found)
    shardProcess.on('error', (error) => {
      console.error(`Shard ${i} error:`, error);
      reject({ shard: i, error: error.message, success: false });
    });

    // Handle process exit
    shardProcess.on('exit', (code) => {
      if (code === 0) {
        resolve({ shard: i, success: true });
      } else {
        console.error(`Shard ${i} exited with code ${code}`);
        reject({ shard: i, code, success: false });
      }
    });
  });

  shardPromises.push(shardPromise);
}

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
          const { shard, code, error } = failure.reason;
          if (error) {
            console.error(`  - Shard ${shard}: spawn error - ${error}`);
          } else {
            console.error(`  - Shard ${shard}: exit code ${code}`);
          }
        }
      });
      console.log(`✅ ${succeeded.length} shard(s) succeeded`);
      process.exit(1);
    }
  });

