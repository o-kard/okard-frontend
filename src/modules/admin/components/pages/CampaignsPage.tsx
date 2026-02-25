"use client";
import AdminLayout from "../AdminLayout";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Button, TextField, InputAdornment, Chip, IconButton, Menu, MenuItem,
  Box, Typography, Stack, Avatar, Paper, TableContainer, Table,
  TableHead, TableRow, TableCell, TableBody
} from "@mui/material";
import { fetchPosts, changeStatus } from "@/modules/post/api/api";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useAuth } from "@clerk/nextjs";

const statusColors: Record<string, string> = {
  active: "#12C998",
  suspended: "#ff5252",
  pending: "#ffd600",
};

const ActionMenu = ({ onSuspend }: { onSuspend: () => void }) => {
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
        <MenuItem onClick={handleClose} sx={{ fontSize: '0.9rem', color: '#222222', '&:hover': { background: 'rgba(18, 201, 152, 0.08)', color: '#12C998' } }}>View</MenuItem>
        <MenuItem onClick={(e) => { handleClose(e); onSuspend(); }} sx={{ fontSize: '0.9rem', color: '#222222', '&:hover': { background: 'rgba(244, 114, 182, 0.08)', color: '#F472B6' } }}>Toggle Status</MenuItem>
        <MenuItem onClick={handleClose} sx={{ fontSize: '0.9rem', color: '#ff5252', '&:hover': { background: 'rgba(255, 82, 82, 0.08)' } }}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const posts = await fetchPosts();
        const campaignsData = posts.map((post) => {
          const goal = post.goal_amount || 0;
          const raised = post.current_amount || 0;
          const progress =
            goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
          return {
            id: post.id,
            name: post.post_header,
            creator: post.user?.username || "Unknown",
            status: post.status,
            goal,
            raised,
            category: post.category || "-",
            progress,
            created_at: post.created_at,
          };
        });
        setCampaigns(campaignsData);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      }
    }
    loadCampaigns();
  }, []);

  const filtered = campaigns.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.creator.toLowerCase().includes(search.toLowerCase())
  );

  function formatDate(dateStr: string) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString() +
      " " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }

  async function changeCampaignStatus(currentStatus: string) {
    if (!selectedId) return;
    try {
      const token = await getToken();
      const newStatus = currentStatus === "active" ? "suspended" : "active";
      await changeStatus(selectedId, newStatus, token);
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === selectedId ? { ...c, status: newStatus } : c
        )
      );
    } catch (e) {
      console.error("Failed to change campaign status", e);
    } finally {
      setConfirmOpen(false);
      setSelectedId(null);
    }
  }

  return (
    <AdminLayout>
      <Box sx={{
        maxWidth: "1200px",
        mx: "auto",
        animation: "fadeIn 0.5s ease-out",
        "@keyframes fadeIn": { from: { opacity: 0, transform: "translateY(10px)" }, to: { opacity: 1, transform: "translateY(0)" } }
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#222222", m: 0, letterSpacing: "-0.02em" }}>
              Campaigns
            </Typography>
            <Typography variant="body1" sx={{ color: "#666666", mt: 1, fontWeight: 400 }}>
              View and manage all campaigns in the system.
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            mb: 3,
            bgcolor: "#ffffff",
            p: 2.5,
            borderRadius: 4,
            border: "1px solid rgba(0, 0, 0, 0.15)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.02)",
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search campaigns or creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "#12C998" }} />
                </InputAdornment>
              ),
              sx: {
                background: "#f8fafc",
                color: "#222222",
                borderRadius: "0.75rem",
                border: "1px solid rgba(18, 201, 152, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  border: "1px solid rgba(18, 201, 152, 0.6)",
                },
                "&.Mui-focused": {
                  border: "1px solid #12C998",
                  boxShadow: "0 0 0 3px rgba(18, 201, 152, 0.15)",
                },
                "& fieldset": { border: "none" },
              },
            }}
            sx={{ width: 360 }}
          />
          <Chip
            label={`${filtered.length} Campaigns`}
            sx={{
              background: "rgba(244, 114, 182, 0.1)",
              color: "#F472B6",
              fontWeight: 600,
              borderRadius: "0.5rem",
              border: "1px solid rgba(244, 114, 182, 0.4)",
            }}
          />
        </Stack>

        <TableContainer component={Paper} elevation={0} sx={{
          bgcolor: "#ffffff",
          borderRadius: 4,
          border: "1px solid rgba(0, 0, 0, 0.15)",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
          overflow: "hidden"
        }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 600, color: "#666666", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>Campaign</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#666666", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>Creator</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#666666", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#666666", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "#666666", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>Goal</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "#666666", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>Raised</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: "#666666", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>Progress</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: "#666666", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>Created At</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "#666666", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((p, index) => (
                <TableRow
                  key={p.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    '&:hover': { bgcolor: 'rgba(18, 201, 152, 0.04) !important' }
                  }}
                >
                  <TableCell>
                    <Typography sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', fontWeight: 600, color: '#222222', fontSize: '0.95rem' }}>
                      {p.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{
                        width: 28, height: 28,
                        background: 'linear-gradient(135deg, #12C998 0%, #F472B6 100%)',
                        fontWeight: 'bold', fontSize: '0.8rem',
                        boxShadow: '0 2px 8px rgba(244, 114, 182, 0.3)'
                      }}>
                        {p.creator.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography sx={{ color: '#666666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px', fontSize: '0.9rem' }}>
                        {p.creator}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box component="span" sx={{
                      bgcolor: 'rgba(18, 201, 152, 0.1)',
                      color: '#12C998',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 4,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: '1px solid rgba(18, 201, 152, 0.4)'
                    }}>
                      {p.category}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={p.status}
                      sx={{
                        background: `${statusColors[p.status]}20`,
                        color: statusColors[p.status],
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        px: 1,
                        borderRadius: 1.5,
                        border: `1px solid ${statusColors[p.status]}50`
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#666666" }}>
                    ${p.goal.toLocaleString()}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#666666", fontWeight: 600 }}>
                    ${p.raised.toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      minWidth: '40px', height: '24px', bgcolor: '#f8fafc',
                      borderRadius: 1, fontWeight: 600, color: '#12C998',
                      border: '1px solid rgba(0, 0, 0, 0.15)', fontSize: '0.8rem'
                    }}>
                      {p.progress}%
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#666666', fontSize: '0.85rem' }}>
                    {formatDate(p.created_at)}
                  </TableCell>
                  <TableCell align="right">
                    <ActionMenu onSuspend={() => {
                      setSelectedId(p.id);
                      setConfirmOpen(true);
                    }} />
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
                No campaigns found
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
                We couldn't find any campaigns matching "{search}"
              </Typography>
            </Stack>
          )}
        </TableContainer>
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Admin Action</DialogTitle>
          <DialogContent>
            <Typography>Do you want to suspend this campaign?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={() =>
                changeCampaignStatus(
                  campaigns.find((c) => c.id === selectedId)?.status || ""
                )
              }
              color="warning"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}
