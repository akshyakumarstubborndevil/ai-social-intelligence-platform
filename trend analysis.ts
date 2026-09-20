import Post from "../models/Post.js";

export async function getTrendAnalysis() {
  const posts = await Post.find().sort({ createdAt: -1 }).lean();

  const topicMap: Record<string, number> = {};
  const sentimentMap: Record<string, number> = {
    Positive: 0,
    Neutral: 0,
    Negative: 0,
  };

  for (const post of posts) {
    sentimentMap[post.sentiment] =
      (sentimentMap[post.sentiment] || 0) + 1;

    for (const topic of post.topics || []) {
      topicMap[topic] = (topicMap[topic] || 0) + 1;
    }
  }

  const trends = Object.entries(topicMap)
    .map(([topic, count]) => ({
      topic,
      count,
      sentiment:
        count > 0 && sentimentMap.Negative > sentimentMap.Positive
          ? "Negative"
          : "Neutral",
      growth:
        count >= 5
          ? "High"
          : count >= 3
            ? "Medium"
            : "Low",
    }))
    .sort((a, b) => b.count - a.count);

  return {
    trends,
    sentiment: sentimentMap,
    totalPosts: posts.length,
    generatedAt: new Date().toISOString(),
  };
}