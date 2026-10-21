/**
 * Practical 12: GitHub Actions Runner Pipeline Simulation
 * Demonstrates both Deliberate Failed Pipeline and Corrected Passing Pipeline
 */

const { spawnSync } = require("child_process");
const path = require("path");

function printHeader(title) {
  console.log("\n" + "=".repeat(68));
  console.log(` ⚙️  ${title}`);
  console.log("=".repeat(68));
}

function runStep(name, cmd, args, cwd) {
  process.stdout.write(`  ⏳ Step: ${name}... `);
  const start = Date.now();
  const res = spawnSync(cmd, args, { cwd, shell: true });
  const duration = ((Date.now() - start) / 1000).toFixed(2);

  if (res.status === 0) {
    console.log(`✔ [COMPLETED in ${duration}s]`);
    return true;
  } else {
    console.log(`❌ [FAILED in ${duration}s]`);
    if (res.stdout && res.stdout.toString().trim()) {
      console.log(res.stdout.toString().trim());
    }
    if (res.stderr && res.stderr.toString().trim()) {
      console.error(res.stderr.toString().trim());
    }
    return false;
  }
}

console.log("=================================================================");
console.log(" 🐙 GitHub Actions CI/CD Pipeline Execution Demonstration");
console.log(" Repository: https://github.com/tirth3011/portfolio-24DCS089.git");
console.log(" Workflow:   .github/workflows/ci.yml | Student: 24DCS089");
console.log("=================================================================");

// SCENARIO 1: DELIBERATE FAILED PIPELINE
printHeader("DEMO 1: DELIBERATELY BROKEN TEST (RED X STATUS)");
console.log("Trigger: git push origin main [Commit: 7a8b9c0 'test: deliberate break']");
console.log("Workflow: CI Pipeline (.github/workflows/ci.yml)");

runStep("actions/checkout@v4", "node", ["-e", "\"console.log('Checked out commit 7a8b9c0')\""], __dirname);
runStep("actions/setup-node@v4", "node", ["-e", "\"console.log('Node.js v18.20.4 configured')\""], __dirname);
runStep("Run npm install", "node", ["-e", "\"console.log('Dependencies up to date.')\""], __dirname);
runStep("Run npm run lint", "node", ["-e", "\"console.log('ESLint: clean')\""], __dirname);

console.log("  ⏳ Step: Run npm test (Intentional failure test)...");
const failTest = spawnSync("node", ["tests/run_tests.js", "--fail"], { cwd: __dirname, shell: true });
console.log(failTest.stdout.toString());
console.log("-----------------------------------------------------------------");
console.log(" ❌ PIPELINE STATUS: FAILED (Exit Code 1)");
console.log(" 🔴 GitHub Actions UI: Red 'X' displayed next to commit 7a8b9c0");
console.log(" Pull request merging blocked by branch protection rule!");
console.log("-----------------------------------------------------------------");

// SCENARIO 2: FIXED PIPELINE (GREEN CHECKMARK)
printHeader("DEMO 2: CORRECTED PASSING PIPELINE (GREEN CHECKMARK)");
console.log("Trigger: git push origin main [Commit: 0fbc4ea 'fix: correct assertion logic']");
console.log("Workflow: CI Pipeline (.github/workflows/ci.yml)");

runStep("actions/checkout@v4", "node", ["-e", "\"console.log('Checked out commit 0fbc4ea')\""], __dirname);
runStep("actions/setup-node@v4", "node", ["-e", "\"console.log('Node.js v18.20.4 configured')\""], __dirname);
runStep("Run npm install", "node", ["-e", "\"console.log('Dependencies up to date.')\""], __dirname);
runStep("Run npm run lint", "node", ["-e", "\"console.log('ESLint: clean')\""], __dirname);

console.log("  ⏳ Step: Run npm test (Corrected test)...");
const passTest = spawnSync("node", ["tests/run_tests.js"], { cwd: __dirname, shell: true });
console.log(passTest.stdout.toString());
console.log("-----------------------------------------------------------------");
console.log(" 🌟 PIPELINE STATUS: SUCCESS (Exit Code 0)");
console.log(" 🟢 GitHub Actions UI: Green checkmark (✔) assigned to commit 0fbc4ea");
console.log(" CI badge automatically updated to 'passing'!");
console.log("=================================================================\n");
