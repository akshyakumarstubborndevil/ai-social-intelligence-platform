import { Router } from "express";
import Post from "../models/Post.js";

const router = Router();

router.get("/summary", async (_req, res) => {
  try {
    const posts = await Post.find().lean();

    const totalPosts = posts.length;

    const negativePosts = posts.filter(
      (post) => post.sentiment === "Negative"
    ).length;

    const positivePosts = posts.filter(
      (post) => post.sentiment === "Positive"
    ).length;

    const neutralPosts = posts.filter(
      (post) => post.sentiment === "Neutral"
    ).length;

    const activeAlerts = posts.filter(
      (post) =>
        post.intent === "Urgent Alert" ||
        post.sentiment === "Negative"
    ).length;

    const emergingIssues = posts.filter(
      (post) =>
        post.intent === "Complaint" ||
        post.intent === "Urgent Alert"
    ).length;

    const topicMap: Record<string, number> = {};

    for (const post of posts) {
      for (const topic of post.topics || []) {
        topicMap[topic] = (topicMap[topic] || 0) + 1;
      }
    }

    const topTopics = Object.entries(topicMap)
      .map(([topic, count]) => ({
        topic,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({
      totalPosts,
      activeAlerts,
      emergingIssues,

      sentimentCounts: {
        positive: positivePosts,
        neutral: neutralPosts,
        negative: negativePosts,
      },

      topTopics,

      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load dashboard summary",
    });
  }
});

export default router;