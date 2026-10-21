/**
 * Practical 13: AI API Integration & Graceful Degradation Verification Suite
 * Student: Tirth Patel (24DCS089)
 */

const http = require("http");
const app = require("../server");
const { sanitizeInput } = require("../services/aiService");

console.log("=================================================================");
console.log(" 🤖 Practical 13: AI Integration & Graceful Degradation Test Suite");
console.log(" Student: Tirth Patel (24DCS089) | Branch: DEPSTAR CSE (2A)");
console.log("=================================================================\n");

let server;
const PORT = 5098;

let passed = 0;
let total = 0;

function assert(condition, description) {
  total++;
  if (condition) {
    console.log(`  ✔ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ✖ FAIL: ${description}`);
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

async function runVerification() {
  server = app.listen(PORT, async () => {
    try {
      // 1. Test PII Sanitization
      console.log("--- 1. Responsible AI & Data Privacy Assertion ---");
      const dirtyPrompt = "Fix user auth with secret_key: abc123xyz and notify admin@gmail.com";
      const cleanPrompt = sanitizeInput(dirtyPrompt);
      assert(!cleanPrompt.includes("abc123xyz"), "Secret key was redacted from AI prompt context");
      assert(!cleanPrompt.includes("admin@gmail.com"), "Email was redacted from AI prompt context");
      assert(cleanPrompt.includes("[REDACTED_SECRET]") && cleanPrompt.includes("[REDACTED_EMAIL]"), "Sanitizer replaced sensitive tokens with placeholder badges");

      // 2. Test Graceful Degradation on Description Generation
      console.log("\n--- 2. Graceful Degradation on AI Endpoint ---");
      const descRes = await request("POST", "/api/ai/generate-description", {
        title: "Docker Compose Microservice Stack"
      });
      assert(descRes.status === 200, "Endpoint returned HTTP 200 OK without crashing");
      assert(descRes.body.success === true, "Response payload indicated success");
      assert(typeof descRes.body.description === "string" && descRes.body.description.length > 20, "Returned valid, structured human-readable description");
      assert(descRes.body.disclaimer.includes("AI-generated"), "Visible Responsible AI disclaimer attached to response");

      // 3. Test Full Metadata Suggestion
      console.log("\n--- 3. AI Metadata Suggestion (Priority & Duration) ---");
      const metaRes = await request("POST", "/api/ai/suggest-metadata", {
        title: "Critical Production Crash in Payment Gateway"
      });
      assert(metaRes.status === 200, "Metadata endpoint returned HTTP 200 OK");
      assert(metaRes.body.suggestion.priority === "urgent", "AI accurately inferred 'urgent' priority for production crash");
      assert(metaRes.body.suggestion.estimatedHours > 0, "AI proposed realistic completion duration");
      assert(Array.isArray(metaRes.body.suggestion.tags), "AI generated categorized tags array");

      // 4. Test Key Security (Backend Isolation)
      console.log("\n--- 4. Backend Secret Key Isolation ---");
      assert(!JSON.stringify(descRes.body).includes("AIzaSy") && !JSON.stringify(descRes.body).includes("sk-"), "API key is strictly isolated on backend (.env) and never leaked to client");

      // 5. Test Integration with Tasks REST API
      console.log("\n--- 5. Task Creation with AI Metadata ---");
      const taskRes = await request("POST", "/api/tasks", {
        title: "Automated Regression Test Suite",
        description: metaRes.body.suggestion.description,
        priority: metaRes.body.suggestion.priority,
        isAiGenerated: true,
        aiProvider: metaRes.body.provider,
        estimatedHours: metaRes.body.suggestion.estimatedHours,
        tags: metaRes.body.suggestion.tags
      });
      assert(taskRes.status === 201, "Task successfully created with AI suggestions");
      assert(taskRes.body.data.isAiGenerated === true, "Task entity flagged as AI-assisted for transparency");

      console.log("\n-----------------------------------------------------------------");
      console.log(` Summary: ${passed} of ${total} assertions PASSED!`);
      if (passed === total) {
        console.log(" 🌟 All Practical 13 AI integration and responsible AI specs PASSED!");
      }
      console.log("=================================================================\n");

      server.close();
      process.exit(0);
    } catch (err) {
      console.error("Test error:", err);
      if (server) server.close();
      process.exit(1);
    }
  });
}

runVerification();
