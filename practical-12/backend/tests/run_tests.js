/**
 * Practical 12: Automated Test Suite for GitHub Actions CI/CD Pipeline
 * Student: Tirth Patel (24DCS089)
 */

const http = require("http");
const app = require("../server");

const isFailMode = process.argv.includes("--fail");

console.log("=================================================================");
console.log(" 🧪 GitHub Actions CI Test Runner");
console.log(` Student: Tirth Patel (24DCS089) | Mode: ${isFailMode ? 'FAIL DEMO (Red X)' : 'PASS SUITE (Green Checkmark)'}`);
console.log("=================================================================\n");

let server;
const PORT = 5099; // Isolated test port

let passed = 0;
let failed = 0;

function assert(description, condition, actual, expected) {
  if (condition) {
    console.log(`  ✔ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ✖ FAIL: ${description}`);
    console.error(`         Expected: ${expected}`);
    console.error(`         Received: ${actual}`);
    failed++;
  }
}

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: "localhost",
        port: PORT,
        path: path,
        method: method,
        headers: {
          "Content-Type": "application/json",
          ...(postData ? { "Content-Length": Buffer.byteLength(postData) } : {})
        }
      },
      (res) => {
        let data = "";
        res.on("data", chunk => (data += chunk));
        res.on("end", () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            parsed = data;
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );
    req.on("error", reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  server = app.listen(PORT, async () => {
    try {
      // Test 1: GET /api/health
      const healthRes = await request("GET", "/api/health");
      assert("GET /api/health returns HTTP 200", healthRes.status === 200, healthRes.status, 200);

      // Test 2: GET /api/tasks
      const tasksRes = await request("GET", "/api/tasks");
      assert("GET /api/tasks returns HTTP 200 and array", tasksRes.status === 200 && Array.isArray(tasksRes.body.data), tasksRes.status, 200);

      // Test 3: POST /api/tasks (Valid Task)
      const createRes = await request("POST", "/api/tasks", {
        title: "Automated CI Pipeline Verification Task",
        priority: "high"
      });
      assert("POST /api/tasks returns HTTP 201 Created", createRes.status === 201, createRes.status, 201);

      // Test 4: POST /api/tasks (Validation Failure)
      const invalidRes = await request("POST", "/api/tasks", { title: "" });
      assert("POST /api/tasks with empty title returns HTTP 400 Bad Request", invalidRes.status === 400, invalidRes.status, 400);

      // Test 5: Intentional Failure / Fixed Demonstration
      if (isFailMode) {
        // Deliberately broken assertion to demonstrate CI failure:
        console.log("\n  ⚠️ [INTENTIONAL FAILURE TEST DEMO]");
        const failCheck = await request("GET", "/api/health");
        assert("Intentional Break: Check status code matches 500", failCheck.status === 500, failCheck.status, 500);
      } else {
        // Corrected passing test:
        const fixedCheck = await request("GET", "/api/health");
        assert("Fixed Test: Health check operational verification", fixedCheck.status === 200, fixedCheck.status, 200);
      }

      console.log("\n-----------------------------------------------------------------");
      console.log(` Test Suites: 1 total`);
      console.log(` Tests:       ${passed} passed, ${failed} failed, ${passed + failed} total`);
      console.log("-----------------------------------------------------------------");

      server.close();

      if (failed > 0) {
        console.error(" ❌ CI Pipeline Step FAILED with non-zero exit code 1.\n");
        process.exit(1);
      } else {
        console.log(" 🌟 CI Pipeline Step PASSED with exit code 0! Green checkmark.\n");
        process.exit(0);
      }
    } catch (err) {
      console.error("Fatal test runner error:", err);
      if (server) server.close();
      process.exit(1);
    }
  });
}

runTests();
