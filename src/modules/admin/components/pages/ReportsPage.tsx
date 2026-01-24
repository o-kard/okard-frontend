"use client";
import AdminLayout from '../AdminLayout';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Button, TextField, InputAdornment, Chip } from '@mui/material';

const mockReports = [
  { id: 1, project: 'Tech for All', reporter: 'Eve', reason: 'Fraudulent activity', status: 'Pending' },
  { id: 2, project: 'Ocean Cleanup', reporter: 'Sam', reason: 'Inappropriate content', status: 'Reviewed' },
  { id: 3, project: 'Solar Schools', reporter: 'Alex', reason: 'Spam', status: 'Pending' },
];

const statusColors: Record<string, string> = {
  Pending: '#ffd600',
  Reviewed: '#1de9b6',
};

export default function ReportsPage() {
  const [search, setSearch] = useState('');
  const filtered = mockReports.filter(r =>
    r.project.toLowerCase().includes(search.toLowerCase()) ||
    r.reporter.toLowerCase().includes(search.toLowerCase()) ||
    r.reason.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <AdminLayout>
      <h1 style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: '2rem', color: '#1de9b6' }}>Reports</h1>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search reports..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: '#7de2d1' }} />
              </InputAdornment>
            ),
            style: { background: '#22304a', color: '#e6f7fa', borderRadius: 8 },
          }}
          sx={{ width: 320 }}
        />
      </div>
      <div style={{ background: '#22304a', borderRadius: 16, padding: 0, overflow: 'auto', boxShadow: '0 2px 16px 0 #10151f33' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, color: '#e6f7fa', fontSize: 15 }}>
          <thead>
            <tr style={{ background: 'rgba(29,233,182,0.08)' }}>
              <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 600, letterSpacing: 0.2 }}>Project</th>
              <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 600, letterSpacing: 0.2 }}>Reporter</th>
              <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 600, letterSpacing: 0.2 }}>Reason</th>
              <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 600, letterSpacing: 0.2 }}>Status</th>
              <th style={{ textAlign: 'center', padding: '16px 20px', fontWeight: 600, letterSpacing: 0.2 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                style={{
                  borderTop: '1px solid #26334d',
                  transition: 'background 0.18s cubic-bezier(.4,0,.2,1)',
                  cursor: 'pointer',
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#1a2333')}
                onMouseOut={e => (e.currentTarget.style.background = 'none')}
              >
                <td style={{ padding: '14px 20px', fontWeight: 500 }}>{r.project}</td>
                <td style={{ padding: '14px 20px' }}>{r.reporter}</td>
                <td style={{ padding: '14px 20px' }}>{r.reason}</td>
                <td style={{ padding: '14px 20px' }}>
                  <Chip label={r.status} sx={{ background: statusColors[r.status], color: '#181f2a', fontWeight: 700, fontSize: 13, px: 1.5, borderRadius: 1.5, boxShadow: '0 1px 4px #0002' }} size="small" />
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                  <Button size="small" variant="outlined" sx={{ color: '#1de9b6', borderColor: '#1de9b6', mr: 1, borderRadius: 2, fontWeight: 600, transition: 'all 0.18s', '&:hover': { background: '#1de9b622', borderColor: '#1de9b6' } }}>Mark Reviewed</Button>
                  <Button size="small" variant="outlined" sx={{ color: '#ff5252', borderColor: '#ff5252', borderRadius: 2, fontWeight: 600, transition: 'all 0.18s', '&:hover': { background: '#ff525222', borderColor: '#ff5252' } }}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: '#7de2d1' }}>No reports found.</div>
        )}
      </div>
    </AdminLayout>
  );
}
