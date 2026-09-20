import React, { useEffect, useState } from "react";

type Dashboard = {
  totalPosts: number;
  activeAlerts: number;
  emergingIssues: number;
  sentimentCounts: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topTopics: {
    topic: string;
    count: number;
  }[];
};

export default function App() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Dashboard API failed");
        }

        return response.json();
      })
      .then((data) => {
        setDashboard(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Dashboard data could not be loaded.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="app">
        <main className="main">
          <div className="loading">
            <h2>AI Social Intelligence</h2>
            <p>Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">AI</div>

          <div>
            <h1>Social Intelligence</h1>
            <span>Early Warning Platform</span>
          </div>
        </div>

        <nav>
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item">Social Analytics</button>
          <button className="nav-item">Trends</button>
          <button className="nav-item">Alerts</button>
          <button className="nav-item">Evidence</button>
          <button className="nav-item">Forecast</button>
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot"></span>
          System Online
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">AI-POWERED MONITORING</p>
            <h2>Social Intelligence Dashboard</h2>
          </div>

          <div className="live-status">
            ● Live Monitoring
          </div>
        </header>

        {error && (
          <div className="card">
            <p>{error}</p>
          </div>
        )}

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Posts</span>
            <strong>{dashboard?.totalPosts ?? 0}</strong>
          </div>

          <div className="stat-card">
            <span>Active Alerts</span>
            <strong>{dashboard?.activeAlerts ?? 0}</strong>
          </div>

          <div className="stat-card">
            <span>Emerging Issues</span>
            <strong>{dashboard?.emergingIssues ?? 0}</strong>
          </div>

          <div className="stat-card">
            <span>Negative Posts</span>
            <strong>
              {dashboard?.sentimentCounts?.negative ?? 0}
            </strong>
          </div>
        </section>

        <section className="content-grid">
          <div className="card">
            <h3>Sentiment Overview</h3>

            <div className="row">
              <span>Positive</span>
              <strong>
                {dashboard?.sentimentCounts?.positive ?? 0}
              </strong>
            </div>

            <div className="row">
              <span>Neutral</span>
              <strong>
                {dashboard?.sentimentCounts?.neutral ?? 0}
              </strong>
            </div>

            <div className="row">
              <span>Negative</span>
              <strong>
                {dashboard?.sentimentCounts?.negative ?? 0}
              </strong>
            </div>
          </div>

          <div className="card">
            <h3>Top Topics</h3>

            {dashboard?.topTopics?.length ? (
              dashboard.topTopics.map((item) => (
                <div className="row" key={item.topic}>
                  <span>{item.topic}</span>
                  <strong>{item.count}</strong>
                </div>
              ))
            ) : (
              <p className="muted">
                No topics available yet.
              </p>
            )}
          </div>
        </section>

        <section className="card">
          <h3>AI Intelligence</h3>

          <div className="analysis-grid">
            <div className="info">
              <span>Trend Detection</span>
              <strong>Active</strong>
            </div>

            <div className="info">
              <span>Early Warning</span>
              <strong>Monitoring</strong>
            </div>

            <div className="info">
              <span>Root Cause</span>
              <strong>Ready</strong>
            </div>

            <div className="info">
              <span>Forecasting</span>
              <strong>Ready</strong>
            </div>
          </div>
        </section>

        <section className="card">
          <h3>Platform Coverage</h3>

          <div className="tags">
            <span>X / Twitter</span>
            <span>Telegram</span>
            <span>Reddit</span>
            <span>YouTube</span>
            <span>Telugu</span>
            <span>Hindi</span>
            <span>English</span>
            <span>Tenglish</span>
          </div>
        </section>
      </main>
    </div>
  );
}