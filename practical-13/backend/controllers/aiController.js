const aiService = require("../services/aiService");

// @desc    Generate AI Task Description
// @route   POST /api/ai/generate-description
exports.generateDescription = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Task title is required to generate AI suggestions"
      });
    }

    const clientIp = req.ip || req.connection.remoteAddress || "127.0.0.1";
    const result = await aiService.generateAiTaskContent(title, clientIp);

    if (result.error && result.rateLimited) {
      return res.status(429).json({
        success: false,
        message: result.message,
        retryAfterSeconds: result.retryAfterSeconds
      });
    }

    return res.status(200).json({
      success: true,
      description: result.description,
      fallback: result.fallback,
      provider: result.provider,
      disclaimer: result.disclaimer || "⚠️ AI-generated suggestion. Please review before saving."
    });
  } catch (err) {
    // Ultimate Graceful Degradation Safeguard: never let unexpected error crash response
    console.error("✖ [AI Controller Error]:", err.message);
    res.status(200).json({
      success: true,
      description: `Task implementation plan for ${req.body?.title || 'task'}.`,
      fallback: true,
      provider: "Emergency Safe Fallback",
      disclaimer: "⚠️ AI service encountered an exception. Fallback activated."
    });
  }
};

// @desc    Generate Complete AI Metadata (Description, Priority, Hours, Tags)
// @route   POST /api/ai/suggest-metadata
exports.suggestMetadata = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Task title is required"
      });
    }

    const clientIp = req.ip || req.connection.remoteAddress || "127.0.0.1";
    const result = await aiService.generateAiTaskContent(title, clientIp);

    if (result.error && result.rateLimited) {
      return res.status(429).json({
        success: false,
        message: result.message,
        retryAfterSeconds: result.retryAfterSeconds
      });
    }

    return res.status(200).json({
      success: true,
      suggestion: {
        title: title.trim(),
        description: result.description,
        priority: result.priority,
        estimatedHours: result.estimatedHours,
        tags: result.tags
      },
      fallback: result.fallback,
      provider: result.provider,
      disclaimer: result.disclaimer
    });
  } catch (err) {
    console.error("✖ [AI Suggest Metadata Error]:", err.message);
    res.status(200).json({
      success: true,
      suggestion: {
        title: req.body?.title || "Task",
        description: "Task description generated via safe fallback engine.",
        priority: "medium",
        estimatedHours: 2,
        tags: ["task"]
      },
      fallback: true,
      provider: "Emergency Safe Fallback",
      disclaimer: "⚠️ Fallback metadata provided."
    });
  }
};

// @desc    Get AI Integration Telemetry
// @route   GET /api/ai/telemetry
exports.getTelemetry = (req, res) => {
  const telemetry = aiService.getTelemetry();
  res.status(200).json({
    success: true,
    telemetry
  });
};
