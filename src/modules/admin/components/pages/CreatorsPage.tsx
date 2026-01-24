"use client";
import AdminLayout from '../AdminLayout';
import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Button, TextField, InputAdornment, Chip } from '@mui/material';
import { listUsers } from '@/modules/user/api/api';
import { fetchPosts } from '@/modules/post/api/api';

const statusColors: Record<string, string> = {
  Active: '#1de9b6',
  Suspended: '#ff5252',
  Pending: '#ffd600',
};

export default function CreatorsPage() {
  const [search, setSearch] = useState('');
  const [creators, setCreators] = useState<any[]>([]);

  useEffect(() => {
    async function loadCreators() {
      try {
        const users = await listUsers();
        const posts = await fetchPosts();
        const creatorsData = users.map(user => {
          const campaign_number = posts.filter(post => post.user?.id === user.id).length;
          return {
            id: user.id,
            username: user.username,
            email: user.email || '-',
            role: user.role || '-',
            campaign_number,
            status: 'Active', // You may want to adjust this if user status is available
          };
        });
        setCreators(creatorsData);
      } catch (error) {
        console.error('Failed to fetch creators:', error);
      }
    }
    loadCreators();
  }, []);

  const filtered = creators.filter(c =>
    c.username.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: '2rem', color: '#1de9b6' }}>Creators</h1>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search creators..."
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
              <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 600, letterSpacing: 0.2 }}>Username</th>
              <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 600, letterSpacing: 0.2 }}>Email</th>
              <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 600, letterSpacing: 0.2 }}>Role</th>
              <th style={{ textAlign: 'right', padding: '16px 20px', fontWeight: 600, letterSpacing: 0.2 }}>Campaigns</th>
              <th style={{ textAlign: 'center', padding: '16px 20px', fontWeight: 600, letterSpacing: 0.2 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                style={{
                  borderTop: '1px solid #26334d',
                  transition: 'background 0.18s cubic-bezier(.4,0,.2,1)',
                  cursor: 'pointer',
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#1a2333')}
                onMouseOut={e => (e.currentTarget.style.background = 'none')}
              >
                <td style={{ padding: '14px 20px', fontWeight: 500 }}>{c.username}</td>
                <td style={{ padding: '14px 20px' }}>{c.email}</td>
                <td style={{ padding: '14px 20px' }}>{c.role}</td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>{c.campaign_number}</td>
                <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                  <Button size="small" variant="outlined" sx={{ color: '#1de9b6', borderColor: '#1de9b6', mr: 1, borderRadius: 2, fontWeight: 600, transition: 'all 0.18s', '&:hover': { background: '#1de9b622', borderColor: '#1de9b6' } }}>View</Button>
                  <Button size="small" variant="outlined" sx={{ color: '#ffd600', borderColor: '#ffd600', mr: 1, borderRadius: 2, fontWeight: 600, transition: 'all 0.18s', '&:hover': { background: '#ffd60022', borderColor: '#ffd600' } }}>Suspend</Button>
                  <Button size="small" variant="outlined" sx={{ color: '#ff5252', borderColor: '#ff5252', borderRadius: 2, fontWeight: 600, transition: 'all 0.18s', '&:hover': { background: '#ff525222', borderColor: '#ff5252' } }}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: '#7de2d1' }}>No creators found.</div>
        )}
      </div>
    </AdminLayout>
  );
}
