const { execSync } = require('child_process');
const { makeDirectory, writeTextFile } = require('./files');

async function main() {
  const outputDir = './dist';
  const workflowRunNumber = parseInt(execSync('echo $GITHUB_RUN_NUMBER').toString().trim());
  const commitHash = execSync('git rev-parse HEAD').toString().trim();
  const branchName = execSync('git branch --show-current').toString().trim();
  const result = {
    build: workflowRunNumber,
    hash: commitHash.substring(0, 7),
    full_hash: commitHash,
    branch_name: branchName,
    timestamp: new Date().toISOString()
  };
  await makeDirectory(outputDir);
  await writeTextFile(`${outputDir}/version.json`, JSON.stringify(result, null, 2));
  process.exit(0);
}

main();
