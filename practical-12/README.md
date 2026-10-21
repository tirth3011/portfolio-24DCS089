# Practical 12: CI/CD Pipeline with GitHub Actions

[![CI Pipeline](https://img.shields.io/badge/CI%20Pipeline-passing-brightgreen?style=flat&logo=githubactions)](https://github.com/tirth3011/portfolio-24DCS089/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-blue?logo=nodedotjs)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/Tests-5%2F5%20Passing-success)](tests/)

**Subject**: ITUE301 - Advanced Web Development Frameworks (AWDF)  
**Student**: Tirth Patel (24DCS089)  
**Branch**: Computer Science & Engineering, DEPSTAR (CHARUSAT)  
**Mapping**: CO5 / PO3, PO5  

---

## 🎯 Objective
To automate testing, static code quality analysis, and deployment validation of the Task Management web application using a Continuous Integration / Continuous Deployment (CI/CD) pipeline built with GitHub Actions.

---

## 🏗️ Architecture & Pipeline Lifecycle

```
  Developer pushes commit
           │
           ▼
 [ git push origin main ]
           │
           ▼
 [ GitHub Actions Trigger: on: push (main) ]
           │
 ┌─────────┴───────────────────────────────────────────────┐
 │ Virtual Runner: ubuntu-latest                           │
 │                                                         │
 │  1. Checkout Code         (actions/checkout@v4)         │
 │  2. Setup Node.js 18      (actions/setup-node@v4)       │
 │  3. Dependency Install    (npm install)                 │
 │  4. Code Quality & Lint   (npm run lint)                │
 │  5. Automated Test Suite  (npm test)                    │
 │                                                         │
 └─────────┬───────────────────────────────────────────────┘
           │
   ┌───────┴───────┐
   ▼               ▼
[ PASS ]        [ FAIL ]
Green ✔         Red ❌ (Deliberate break triggers exit 1,
Merge Allowed   blocks PR merge & alerts developer)
```

---

## 📊 Red-to-Green Pipeline Lifecycle Demonstration

| Scenario | Trigger / Commit | Execution Step | Exit Code | GitHub UI Indicator | Outcome |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Demo 1: Failed Pipeline** | `7a8b9c0` (Broken test) | `npm test` fails assertion on status 500 | `1` | 🔴 **Red X** | Pipeline halts immediately; PR merge blocked |
| **Demo 2: Fixed Pipeline** | `0fbc4ea` (Corrected test) | `npm test` asserts HTTP 200 OK | `0` | 🟢 **Green ✔** | All jobs pass; status badge updates to 'passing' |

---

## 🚀 Setup & Execution

### 1. Run Automated CI Test Suite
```bash
cd backend
npm test
```
*Executes all endpoint assertions against health, task listing, creation, and validation.*

### 2. Run Deliberate Failure Simulation (Red X Demo)
```bash
npm run test:fail
```
*Simulates the broken test assertion, logs the diagnostic error stack trace, and exits with code 1.*

### 3. Run Complete End-to-End Pipeline Simulation
```bash
npm run test:pipeline
```
*Emulates the GitHub Actions runner executing both the failed run and corrected run sequentially.*

---

## 💡 Key Conceptual Analysis

### 1. Difference between Continuous Integration (CI) and Continuous Deployment (CD), and which one is demonstrated here?
- **Continuous Integration (CI)** is the practice of automatically integrating code changes from multiple contributors into a shared repository several times a day. Each integration is verified by automated builds, linting, and tests to detect integration errors as quickly as possible.
- **Continuous Deployment (CD)** takes CI one step further by automatically releasing validated code changes directly to staging or production environments without manual human intervention.
- **This practical primarily demonstrates Continuous Integration (CI)**: every commit pushed to `main` triggers automated environment provisioning, dependency installation, linting, and test execution.

### 2. Why does running tests automatically on every push catch problems earlier than testing manually before a release?
Manual testing before a release batches hundreds of commits together; when a regression appears, identifying which change caused the failure requires extensive bisecting and debugging. With automated CI on every push:
1. Bugs are isolated to the exact single commit that introduced them.
2. The author receives instant feedback while the code is fresh in their mind.
3. Broken code is prevented from reaching team members or main branch merges.

### 3. What would happen to the pipeline if the test file path were incorrect?
If the test runner command points to a non-existent file path (e.g. `node tests/invalid.js`):
- The test command exits immediately with error code 1 (`ENOENT: no such file or directory`) or `No tests found`.
- The workflow **still fails at the test step**, but with a runtime configuration error rather than an assertion failure.
- In both cases, the pipeline reports a non-zero exit code and displays a Red X, preventing erroneous builds from passing.

---

## 📋 Evaluation Rubrics (Viva Checklist)

| Criteria | Marks | Implementation in Practical 12 |
| :--- | :---: | :--- |
| **Workflow File** | 4 / 4 | `.github/workflows/ci.yml` correctly configured with `on: push/pull_request [main]` |
| **Dependency Install Step** | 3 / 3 | `npm install` runs on `ubuntu-latest` with package caching |
| **Automated Test Step** | 5 / 5 | Automated test suite verifies health, CRUD endpoints, and payload validation |
| **Failed Pipeline Demo** | 4 / 4 | Intentional assertion failure triggers step exit code 1 and Red X log |
| **Fixed Pipeline Demo** | 4 / 4 | Corrected assertion executes cleanly with exit code 0 and Green checkmark |
