export type AnalysisResult = {
  language: string;
  sentiment: string;
  emotion: string;
  intent: string;
  topics: string[];
  keywords: string[];
  rootCause: string;
  recommendedAction: string;
  forecast: string;
};

export function analyzeSocialPost(text: string): AnalysisResult {
  const lower = text.toLowerCase();

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

  let positive = 0;
  let negative = 0;

  for (const word of positiveWords) {
    if (lower.includes(word)) positive++;
  }

  for (const word of negativeWords) {
    if (lower.includes(word)) negative++;
  }

  let sentiment = "Neutral";
  let emotion = "Neutral";

  if (positive > negative) {
    sentiment = "Positive";
    emotion = "Optimistic";
  } else if (negative > positive) {
    sentiment = "Negative";
    emotion = "Concerned";
  }

  let intent = "General Discussion";

  if (urgentWords.some((word) => lower.includes(word))) {
    intent = "Urgent Alert";
    emotion = "Urgent";
  } else if (
    lower.includes("complaint") ||
    lower.includes("not working") ||
    lower.includes("poor service")
  ) {
    intent = "Complaint";
  } else if (text.includes("?")) {
    intent = "Question";
  }

  const topics: string[] = [];

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

  const keywords = [
    ...new Set(
      lower
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 4)
    ),
  ].slice(0, 8);

  let rootCause =
    "Insufficient evidence for root-cause analysis.";

  let recommendedAction =
    "Continue monitoring the discussion.";

  let forecast =
    "No significant short-term trend can be established.";

  if (sentiment === "Negative") {
    rootCause =
      "Negative language and issue-related keywords indicate concern in the available data.";

    recommendedAction =
      "Review related posts and monitor whether the issue continues to grow.";

    forecast =
      "If similar posts continue increasing, the topic may receive higher short-term attention.";
  }

  if (intent === "Urgent Alert") {
    recommendedAction =
      "Prioritize verification of the reported issue and monitor related activity.";

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

function detectLanguage(text: string): string {
  if (/[\u0C00-\u0C7F]/.test(text)) {
    return "Telugu";
  }

  if (/[\u0900-\u097F]/.test(text)) {
    return "Hindi";
  }

  return "English";
}