const express = require("express");
const router = express.Router();
const {
  generateDescription,
  suggestMetadata,
  getTelemetry
} = require("../controllers/aiController");

router.post("/generate-description", generateDescription);
router.post("/suggest-metadata", suggestMetadata);
router.get("/telemetry", getTelemetry);

module.exports = router;
