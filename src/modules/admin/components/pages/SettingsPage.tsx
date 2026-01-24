"use client";
import AdminLayout from '../AdminLayout';
import { useState } from 'react';
import { Button, Switch, TextField, FormControlLabel, Divider } from '@mui/material';

export default function SettingsPage() {
  const [platformName, setPlatformName] = useState('O-Kard');
  const [maintenance, setMaintenance] = useState(false);
  const [supportEmail, setSupportEmail] = useState('support@okard.com');

  return (
    <AdminLayout>
      <h1 style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: '2rem', color: '#1de9b6' }}>Settings</h1>
      <div style={{ background: '#22304a', borderRadius: 12, padding: 32, maxWidth: 520, color: '#e6f7fa' }}>
        <div style={{ marginBottom: 28 }}>
          <TextField
            label="Platform Name"
            variant="outlined"
            size="small"
            value={platformName}
            onChange={e => setPlatformName(e.target.value)}
            fullWidth
            InputProps={{ style: { background: '#181f2a', color: '#e6f7fa', borderRadius: 8 } }}
            InputLabelProps={{ style: { color: '#7de2d1' } }}
          />
        </div>
        <div style={{ marginBottom: 28 }}>
          <TextField
            label="Support Email"
            variant="outlined"
            size="small"
            value={supportEmail}
            onChange={e => setSupportEmail(e.target.value)}
            fullWidth
            InputProps={{ style: { background: '#181f2a', color: '#e6f7fa', borderRadius: 8 } }}
            InputLabelProps={{ style: { color: '#7de2d1' } }}
          />
        </div>
        <Divider sx={{ my: 3, background: '#26334d' }} />
        <FormControlLabel
          control={<Switch checked={maintenance} onChange={e => setMaintenance(e.target.checked)} sx={{ '& .MuiSwitch-thumb': { background: maintenance ? '#ffd600' : '#1de9b6' } }} />}
          label={<span style={{ color: '#e6f7fa' }}>Maintenance Mode</span>}
        />
        <div style={{ marginTop: 32 }}>
          <Button variant="contained" sx={{ background: '#1de9b6', color: '#181f2a', fontWeight: 700, borderRadius: 2, px: 4, py: 1 }}>
            Save Changes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
