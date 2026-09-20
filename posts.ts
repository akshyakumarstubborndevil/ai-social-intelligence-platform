import { Router } from "express";
import Post from "../models/Post.js";

const router = Router();

function analyzeText(text: string) {
  const lower = text.toLowerCase();

  let sentiment = "Neutral";
  let emotion = "Neutral";
  let intent = "General Discussion";

  const positiveWords = [
    "good",
    "great",
    "excellent",
    "happy",
    "success",
    "love",
    "best",
    "improve",
  ];

  const negativeWords = [
    "bad",
    "poor",
    "worst",
    "angry",
    "problem",
    "issue",
    "danger",
    "fail",
    "failure",
    "hate",
    "complaint",
  ];

  const urgentWords = [
    "urgent",
    "emergency",
    "immediately",
    "danger",
    "critical",
    "alert",
  ];

  const complaintWords = [
    "complaint",
    "problem",
    "issue",
    "not working",
    "poor service",
    "bad service",
  ];

  const positiveCount = positiveWords.filter((word) =>
    lower.includes(word)
  ).length;

  const negativeCount = negativeWords.filter((word) =>
    lower.includes(word)
  ).length;

  if (positiveCount > negativeCount) {
    sentiment = "Positive";
    emotion = "Optimistic";
  } else if (negativeCount > positiveCount) {
    sentiment = "Negative";
    emotion = "Concerned";
  }

  if (urgentWords.some((word) => lower.includes(word))) {
    intent = "Urgent Alert";
    emotion = "Urgent";
  } else if (complaintWords.some((word) => lower.includes(word))) {
    intent = "Complaint";
  } else if (
    lower.includes("?") ||
    lower.includes("what") ||
    lower.includes("why") ||
    lower.includes("how")
  ) {
    intent = "Question";
  }

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 4);

  const keywords = [...new Set(words)].slice(0, 8);

  const topics = [];

  if (
    lower.includes("government") ||
    lower.includes("policy") ||
    lower.includes("law")
  ) {
    topics.push("Government & Policy");
  }

  if (
    lower.includes("road") ||
    lower.includes("traffic") ||
    lower.includes("transport")
  ) {
    topics.push("Transport");
  }

  if (
    lower.includes("water") ||
    lower.includes("electricity") ||
    lower.includes("power")
  ) {
    topics.push("Public Services");
  }

  if (
    lower.includes("health") ||
    lower.includes("hospital") ||
    lower.includes("medicine")
  ) {
    topics.push("Healthcare");
  }

  if (
    lower.includes("school") ||
    lower.includes("college") ||
    lower.includes("education")
  ) {
    topics.push("Education");
  }

  if (topics.length === 0) {
    topics.push("General");
  }

  let rootCause = "Insufficient evidence for root-cause analysis.";
  let recommendedAction = "Continue monitoring the discussion.";
  let forecast = "No significant short-term trend can be established.";

  if (sentiment === "Negative") {
    rootCause =
      "Negative language and issue-related keywords indicate growing concern in the available post.";

    recommendedAction =
      "Review related posts, identify the underlying complaint, and monitor whether activity increases.";

    forecast =
      "If similar posts continue increasing, the topic may receive higher short-term attention.";
  }

  if (intent === "Urgent Alert") {
    recommendedAction =
      "Prioritize verification of the reported issue and monitor related activity immediately.";

    forecast =
      "Continued activity around the alert could indicate a developing issue.";
  }

  return {
    language: detectLanguage(text),
    sentiment,
    emotion,
    intent,
    topics,
    keywords,
    rootCause,
    recommendedAction,
    forecast,
  };
}

function detectLanguage(text: string) {
  if (/[\u0C00-\u0C7F]/.test(text)) {
    return "Telugu";
  }

  if (/[\u0900-\u097F]/.test(text)) {
    return "Hindi";
  }

  return "English";
}

router.get("/", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({
      posts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch posts",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { platform, text } = req.body;

    if (!platform || !text || text.trim().length < 5) {
      return res.status(400).json({
        message: "Platform and valid text are required",
      });
    }

    const analysis = analyzeText(text.trim());

    const post = await Post.create({
      platform,
      text: text.trim(),
      ...analysis,
    });

    res.status(201).json({
      success: true,
      post,
      analysis,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to analyze post",
    });
  }
});

export default router;