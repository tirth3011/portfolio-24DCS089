/**
 * Practical 11: Containerization and Docker Compose Verification Suite
 * Student: Tirth Patel (24DCS089)
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

console.log("=================================================================");
console.log(" 🐳 Practical 11: Docker & Docker Compose Verification Suite");
console.log(" Student: Tirth Patel (24DCS089) | Branch: DEPSTAR CSE (2A)");
console.log("=================================================================\n");

let passedAssertions = 0;
let totalAssertions = 0;

function assert(condition, message) {
  totalAssertions++;
  if (condition) {
    console.log(`  ✔ [PASS] ${message}`);
    passedAssertions++;
  } else {
    console.error(`  ✖ [FAIL] ${message}`);
  }
}

// 1. Verify Dockerfile in Backend
const backendDockerfilePath = path.join(__dirname, "Dockerfile");
assert(fs.existsSync(backendDockerfilePath), "Backend Dockerfile exists");
if (fs.existsSync(backendDockerfilePath)) {
  const content = fs.readFileSync(backendDockerfilePath, "utf-8");
  assert(content.includes("FROM node:"), "Backend Dockerfile uses official Node base image");
  assert(content.includes("WORKDIR /app"), "Backend Dockerfile defines /app working directory");
  assert(content.includes("COPY package*.json ./"), "Backend Dockerfile leverages package caching layer");
  assert(content.includes("EXPOSE 5011") || content.includes("EXPOSE 5000"), "Backend Dockerfile declares EXPOSE port");
}

// 2. Verify .dockerignore in Backend
const backendDockerignore = path.join(__dirname, ".dockerignore");
assert(fs.existsSync(backendDockerignore), "Backend .dockerignore exists");
if (fs.existsSync(backendDockerignore)) {
  const content = fs.readFileSync(backendDockerignore, "utf-8");
  assert(content.includes("node_modules"), "Backend .dockerignore excludes node_modules");
  assert(content.includes(".env"), "Backend .dockerignore excludes .env credentials");
}

// 3. Verify Docker Compose Configuration
const composePath = path.join(__dirname, "..", "docker-compose.yml");
assert(fs.existsSync(composePath), "Root docker-compose.yml exists");
if (fs.existsSync(composePath)) {
  const content = fs.readFileSync(composePath, "utf-8");
  assert(content.includes("services:"), "docker-compose.yml defines services block");
  assert(content.includes("frontend:"), "docker-compose.yml orchestrates 'frontend' service");
  assert(content.includes("backend:"), "docker-compose.yml orchestrates 'backend' service");
  assert(content.includes("mongodb:"), "docker-compose.yml orchestrates 'mongodb' service");
  assert(content.includes("app-network"), "docker-compose.yml configures internal bridge network");
  assert(content.includes("mongo-data:"), "docker-compose.yml defines persistent named volume");
  assert(content.includes("mongodb://mongodb:27017"), "docker-compose.yml uses service DNS 'mongodb' for DB connection");
}

// 4. Verify Frontend Dockerfile
const frontendDockerfilePath = path.join(__dirname, "..", "frontend", "Dockerfile");
assert(fs.existsSync(frontendDockerfilePath), "Frontend Dockerfile exists");
if (fs.existsSync(frontendDockerfilePath)) {
  const content = fs.readFileSync(frontendDockerfilePath, "utf-8");
  assert(content.includes("AS builder") || content.includes("AS build"), "Frontend Dockerfile implements multi-stage build");
  assert(content.includes("npm run build"), "Frontend Dockerfile builds production static bundle");
}

console.log("\n-----------------------------------------------------------------");
console.log(` [SUMMARY] Verified ${passedAssertions} of ${totalAssertions} Docker assertions.`);
if (passedAssertions === totalAssertions) {
  console.log(" 🌟 All Docker and Docker Compose specifications PASSED successfully!");
}
console.log("=================================================================\n");
