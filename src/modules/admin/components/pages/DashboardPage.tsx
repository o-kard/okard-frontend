import React from 'react';
import AdminLayout from '../AdminLayout';

export default function DashboardPage() {
  // Placeholder for stats and recent activity
  return (
    <AdminLayout>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: '#1de9b6' }}>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Stats Cards */}
        <div style={{ background: '#22304a', borderRadius: 12, padding: '1.5rem 2rem', minWidth: 180, flex: 1, color: '#e6f7fa' }}>
          <div style={{ fontSize: 14, color: '#7de2d1', marginBottom: 8 }}>Total Projects</div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>1,234</div>
        </div>
        <div style={{ background: '#22304a', borderRadius: 12, padding: '1.5rem 2rem', minWidth: 180, flex: 1, color: '#e6f7fa' }}>
          <div style={{ fontSize: 14, color: '#7de2d1', marginBottom: 8 }}>Total Creators</div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>567</div>
        </div>
        <div style={{ background: '#22304a', borderRadius: 12, padding: '1.5rem 2rem', minWidth: 180, flex: 1, color: '#e6f7fa' }}>
          <div style={{ fontSize: 14, color: '#7de2d1', marginBottom: 8 }}>Active Users</div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>2,890</div>
        </div>
        <div style={{ background: '#22304a', borderRadius: 12, padding: '1.5rem 2rem', minWidth: 180, flex: 1, color: '#e6f7fa' }}>
          <div style={{ fontSize: 14, color: '#7de2d1', marginBottom: 8 }}>Pending Requests</div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>8</div>
        </div>
      </div>
      <section style={{ background: '#22304a', borderRadius: 12, padding: '2rem', color: '#e6f7fa' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 16, color: '#1de9b6' }}>Recent Activity</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: 12 }}>• Project <b>"Green Future"</b> was approved.</li>
          <li style={{ marginBottom: 12 }}>• Creator <b>Jane Doe</b> joined the platform.</li>
          <li style={{ marginBottom: 12 }}>• Project <b>"Tech for All"</b> was reported.</li>
          <li>• Creator request from <b>John Smith</b> is pending.</li>
        </ul>
      </section>
    </AdminLayout>
  );
}
