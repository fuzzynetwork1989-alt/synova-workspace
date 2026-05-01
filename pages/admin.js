// Admin Dashboard Page
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../components/AuthContext';
import Head from 'next/head';

function AdminContent() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalGenerations: 0,
    totalUploads: 0,
    activeUsers: 0,
    systemHealth: 'healthy'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'admin') {
      window.location.href = '/';
      return;
    }

    // Load admin stats
    loadAdminStats();
  }, [user]);

  const loadAdminStats = async () => {
    try {
      // Mock stats - in production, fetch from admin API
      setStats({
        totalGenerations: 156,
        totalUploads: 42,
        activeUsers: 8,
        systemHealth: 'healthy'
      });
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Synova AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="admin-main">
        <div className="admin-container">
          <header className="admin-header">
            <h1>Admin Dashboard</h1>
            <div className="admin-user">
              <span>{user?.email} ({user?.role})</span>
              <button onClick={logout} className="logout-button">Sign Out</button>
            </div>
          </header>

          <div className="admin-stats">
            <h2>System Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.totalGenerations}</div>
                <div className="stat-label">Total Generations</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.totalUploads}</div>
                <div className="stat-label">Total Uploads</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.activeUsers}</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-number health-{stats.systemHealth}">
                  {stats.systemHealth}
                </div>
                <div className="stat-label">System Health</div>
              </div>
            </div>
          </div>

          <div className="admin-actions">
            <h2>System Management</h2>
            <div className="actions-grid">
              <div className="action-card">
                <h3>User Management</h3>
                <p>Manage user accounts and permissions</p>
                <button className="action-button">Manage Users</button>
              </div>
              <div className="action-card">
                <h3>System Logs</h3>
                <p>View system activity and error logs</p>
                <button className="action-button">View Logs</button>
              </div>
              <div className="action-card">
                <h3>API Settings</h3>
                <p>Configure API keys and endpoints</p>
                <button className="action-button">Configure API</button>
              </div>
              <div className="action-card">
                <h3>Analytics</h3>
                <p>View usage statistics and metrics</p>
                <button className="action-button">View Analytics</button>
              </div>
            </div>
          </div>

          <div className="admin-footer">
            <button onClick={() => window.location.href = '/'} className="back-to-app">
              Back to Application
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default function Admin() {
  return (
    <AuthProvider>
      <AdminContent />
    </AuthProvider>
  );
}
