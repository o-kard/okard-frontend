"use client";
import AdminLayout from '../AdminLayout';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Button, TextField, InputAdornment, Chip, IconButton, Menu, MenuItem,
  Box, Typography, Stack, Avatar, Paper, TableContainer, Table,
  TableHead, TableRow, TableCell, TableBody
} from '@mui/material';

const mockRequests = [
  { id: 1, name: 'Charlie Brown', email: 'charlie@email.com', status: 'Pending', submitted: '2026-01-01' },
  { id: 2, name: 'Dana White', email: 'dana@email.com', status: 'Pending', submitted: '2026-01-03' },
  { id: 3, name: 'Eve Black', email: 'eve@email.com', status: 'Approved', submitted: '2025-12-30' },
];

const statusColors: Record<string, string> = {
  Pending: '#ffd600',
  Approved: '#12C998',
  Rejected: '#ff5252',
};

const ActionMenu = ({ status }: { status: string }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          color: '#666666',
          '&:hover': { background: 'rgba(0,0,0,0.05)', color: '#222222' }
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          style: {
            borderRadius: '0.75rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
            minWidth: '120px',
            marginTop: '0.25rem',
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {status === 'Pending' ? (
          [
            <MenuItem key="approve" onClick={handleClose} sx={{ fontSize: '0.9rem', color: '#12C998', '&:hover': { background: 'rgba(18, 201, 152, 0.08)' } }}>Approve</MenuItem>,
            <MenuItem key="reject" onClick={handleClose} sx={{ fontSize: '0.9rem', color: '#ff5252', '&:hover': { background: 'rgba(255, 82, 82, 0.08)' } }}>Reject</MenuItem>,
          ]
        ) : (
          <MenuItem onClick={handleClose} sx={{ fontSize: '0.9rem', color: '#ff5252', '&:hover': { background: 'rgba(255, 82, 82, 0.08)' } }}>Revoke</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default function RequestsPage() {
  const [search, setSearch] = useState('');
  const filtered = mockRequests.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <AdminLayout>
      <Box sx={{
        maxWidth: '1200px',
        mx: 'auto',
        animation: 'fadeIn 0.5s ease-out',
        '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#222222', m: 0, letterSpacing: '-0.02em' }}>
              Creator Requests
            </Typography>
            <Typography variant="body1" sx={{ color: '#666666', mt: 1, fontWeight: 400 }}>
              Review and manage pending creator account requests.
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: 3,
            bgcolor: '#ffffff',
            p: 2.5,
            borderRadius: 4,
            border: '1px solid rgba(0, 0, 0, 0.15)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)'
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search requests..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: '#12C998' }} />
                </InputAdornment>
              ),
              sx: {
                background: '#f8fafc',
                color: '#222222',
                borderRadius: '0.75rem',
                border: '1px solid rgba(18, 201, 152, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  border: '1px solid rgba(18, 201, 152, 0.6)',
                },
                '&.Mui-focused': {
                  border: '1px solid #12C998',
                  boxShadow: '0 0 0 3px rgba(18, 201, 152, 0.15)'
                },
                '& fieldset': { border: 'none' }
              },
            }}
            sx={{ width: 360 }}
          />
          <Chip
            label={`${filtered.length} Requests`}
            sx={{
              background: 'rgba(244, 114, 182, 0.1)',
              color: '#F472B6',
              fontWeight: 600,
              borderRadius: '0.5rem',
              border: '1px solid rgba(244, 114, 182, 0.4)'
            }}
          />
        </Stack>

        <TableContainer component={Paper} elevation={0} sx={{
          bgcolor: '#ffffff',
          borderRadius: 4,
          border: '1px solid rgba(0, 0, 0, 0.15)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden'
        }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#666666', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666666', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666666', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Submitted</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#666666', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#666666', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((r, index) => (
                <TableRow
                  key={r.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(18, 201, 152, 0.04) !important' }
                  }}
                >
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar sx={{
                        width: 36, height: 36,
                        background: 'linear-gradient(135deg, #12C998 0%, #F472B6 100%)',
                        fontWeight: 'bold', fontSize: '1rem',
                        boxShadow: '0 2px 8px rgba(244, 114, 182, 0.3)'
                      }}>
                        {r.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', fontWeight: 600, color: '#222222', fontSize: '0.95rem' }}>
                        {r.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: '#666666' }}>{r.email}</TableCell>
                  <TableCell sx={{ color: '#666666' }}>{r.submitted}</TableCell>
                  <TableCell>
                    <Chip
                      label={r.status}
                      sx={{
                        background: `${statusColors[r.status]}20`,
                        color: statusColors[r.status],
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        px: 1,
                        borderRadius: 1.5,
                        border: `1px solid ${statusColors[r.status]}50`
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <ActionMenu status={r.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <Stack alignItems="center" justifyContent="center" sx={{ p: 8 }}>
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 64, height: 64, borderRadius: '50%', bgcolor: '#f8fafc',
                mb: 2, border: '1px solid rgba(0, 0, 0, 0.15)'
              }}>
                <SearchIcon sx={{ color: '#12C998', fontSize: '2rem' }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#222222', fontWeight: 600 }}>
                No requests found
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
                We couldn't find any requests matching "{search}"
              </Typography>
            </Stack>
          )}
        </TableContainer>
      </Box>
    </AdminLayout>
  );
}
