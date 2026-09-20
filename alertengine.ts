import Post from "../models/Post.js";

export async function generateAlerts() {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const alerts = [];

  for (const post of posts) {
    if (post.intent === "Urgent Alert") {
      alerts.push({
        type: "URGENT",
        severity: "HIGH",
        title: "Urgent Activity Detected",
        message: "An urgent or critical signal was detected in the available data.",
        postId: post._id,
        platform: post.platform,
        createdAt: post.createdAt,
      });
    }

    if (post.sentiment === "Negative") {
      alerts.push({
        type: "SENTIMENT",
        severity: "MEDIUM",
        title: "Negative Sentiment Detected",
        message: "Negative sentiment was detected in the analyzed discussion.",
        postId: post._id,
        platform: post.platform,
        createdAt: post.createdAt,
      });
    }

    if (post.intent === "Complaint") {
      alerts.push({
        type: "COMPLAINT",
        severity: "MEDIUM",
        title: "Complaint Detected",
        message: "A complaint-related discussion was detected.",
        postId: post._id,
        platform: post.platform,
        createdAt: post.createdAt,
      });
    }
  }

  return {
    alerts: alerts.slice(0, 20),
    totalAlerts: alerts.length,
    generatedAt: new Date().toISOString(),
  };
}