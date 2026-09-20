const API_BASE = "";

export async function getDashboard() {
  const response = await fetch(`${API_BASE}/api/dashboard/summary`);

  if (!response.ok) {
    throw new Error("Failed to load dashboard");
  }

  return response.json();
}

export async function getPosts(limit = 20) {
  const response = await fetch(`${API_BASE}/api/posts?limit=${limit}`);

  if (!response.ok) {
    throw new Error("Failed to load posts");
  }

  return response.json();
}

export async function analyzePost(platform: string, text: string) {
  const response = await fetch(`${API_BASE}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      platform,
      text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Analysis failed");
  }

  return response.json();
}