"use client";
import AdminLayout from "../AdminLayout";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
  Stack,
  Avatar,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { listUsers, deleteUser, suspendUser } from "@/modules/user/api/api";
import { fetchCampaigns } from "@/modules/campaign/api/api";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const statusColors: Record<string, string> = {
  active: "#1de9b6",
  suspended: "#ff5252",
  pending: "#ffd600",
};

const ActionMenu = ({
  userId,
  onSuspend,
  onDelete,
}: {
  userId: string;
  onSuspend: () => void;
  onDelete: () => void;
}) => {
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
          color: "#666666",
          "&:hover": { background: "rgba(0,0,0,0.05)", color: "#222222" },
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
            borderRadius: "0.75rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.05)",
            minWidth: "120px",
            marginTop: "0.25rem",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={(e) => {
            handleClose(e);
            window.open(`/explore/${userId}`, "_blank");
          }}
          sx={{
            fontSize: "0.9rem",
            color: "#222222",
            "&:hover": {
              background: "rgba(18, 201, 152, 0.08)",
              color: "#12C998",
            },
          }}
        >
          View
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            handleClose(e);
            onSuspend();
          }}
          sx={{
            fontSize: "0.9rem",
            color: "#222222",
            "&:hover": {
              background: "rgba(244, 114, 182, 0.08)",
              color: "#F472B6",
            },
          }}
        >
          Suspend
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            handleClose(e);
            onDelete();
          }}
          sx={{
            fontSize: "0.9rem",
            color: "#ff5252",
            "&:hover": { background: "rgba(255, 82, 82, 0.08)" },
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default function CreatorsPage() {
  const [search, setSearch] = useState("");
  const [creators, setCreators] = useState<any[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCreators() {
      try {
        const users = await listUsers();
        const campaigns = await fetchCampaigns();
        const creatorsData = users.map((user) => {
          const campaign_number = campaigns.filter(
            (campaign) => campaign.user?.id === user.id,
          ).length;
          return {
            id: user.id,
            username: user.username,
            email: user.email || "-",
            role: user.role || "-",
            campaign_number,
            status: user.status || "active",
          };
        });
        setCreators(creatorsData);
      } catch (error) {
        console.error("Failed to fetch creators:", error);
      }
    }
    loadCreators();
  }, []);

  const handleDelete = async (userId: string) => {
    try {
      if (confirm("Are you sure you want to delete this creator?")) {
        await deleteUser(userId);
        setCreators((prev) => prev.filter((c) => c.id !== userId));
      }
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const filtered = creators.filter(
    (c) =>
      c.username.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout>
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          animation: "fadeIn 0.5s ease-out",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(10px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#222222",
                m: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Users Management
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#666666", mt: 1, fontWeight: 400 }}
            >
              View and manage all users in the system.
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
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
            placeholder="Search by username or email..."
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
            label={`${filtered.length} Users Found`}
            sx={{
              background: "rgba(244, 114, 182, 0.1)",
              color: "#F472B6",
              fontWeight: 600,
              borderRadius: "0.5rem",
              border: "1px solid rgba(244, 114, 182, 0.4)",
            }}
          />
        </Stack>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            bgcolor: "#ffffff",
            borderRadius: 4,
            border: "1px solid rgba(0, 0, 0, 0.15)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#666666",
                    textTransform: "uppercase",
                    fontSize: "0.8rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  Username
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#666666",
                    textTransform: "uppercase",
                    fontSize: "0.8rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    color: "#666666",
                    textTransform: "uppercase",
                    fontSize: "0.8rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  Role
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    color: "#666666",
                    textTransform: "uppercase",
                    fontSize: "0.8rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  Campaigns
                </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color: "#666666",
                      textTransform: "uppercase",
                      fontSize: "0.8rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 600,
                      color: "#666666",
                      textTransform: "uppercase",
                      fontSize: "0.8rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Actions
                  </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((c, index) => (
                <TableRow
                  key={c.id}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "rgba(18, 201, 152, 0.04) !important",
                    },
                  }}
                >
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          background:
                            "linear-gradient(135deg, #12C998 0%, #F472B6 100%)",
                          fontWeight: "bold",
                          fontSize: "1rem",
                          boxShadow: "0 2px 8px rgba(244, 114, 182, 0.3)",
                        }}
                      >
                        {c.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "200px",
                          fontWeight: 600,
                          color: "#222222",
                          fontSize: "0.95rem",
                        }}
                      >
                        {c.username}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: "#666666" }}>{c.email}</TableCell>
                  <TableCell align="center">
                    <Box
                      component="span"
                      sx={{
                        bgcolor: "rgba(18, 201, 152, 0.1)",
                        color: "#12C998",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 4,
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        border: "1px solid rgba(18, 201, 152, 0.4)",
                        display: "inline-block",
                      }}
                    >
                      {c.role
                        ? c.role.charAt(0).toUpperCase() + c.role.slice(1)
                        : "-"}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        bgcolor: "#f8fafc",
                        borderRadius: 2,
                        fontWeight: 600,
                        color: "#222222",
                        border: "1px solid rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      {c.campaign_number}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={c.status}
                      sx={{
                        background: `${statusColors[c.status] || "#eee"}20`,
                        color: statusColors[c.status] || "#666",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        px: 1,
                        borderRadius: 1.5,
                        border: `1px solid ${statusColors[c.status] || "#eee"}50`,
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <ActionMenu
                      userId={c.id}
                      onSuspend={() => {
                        setSelectedId(c.id);
                        setConfirmOpen(true);
                      }}
                      onDelete={() => handleDelete(c.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <Stack alignItems="center" justifyContent="center" sx={{ p: 8 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "#f8fafc",
                  mb: 2,
                  border: "1px solid rgba(0, 0, 0, 0.15)",
                }}
              >
                <SearchIcon sx={{ color: "#12C998", fontSize: "2rem" }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ color: "#222222", fontWeight: 600 }}
              >
                No users found
              </Typography>
              <Typography variant="body2" sx={{ color: "#666666", mt: 0.5 }}>
                We couldn't find any users matching "{search}"
              </Typography>
            </Stack>
          )}
        </TableContainer>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Admin Action</DialogTitle>
          <DialogContent>
            <Typography>Do you want to suspend this user?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!selectedId) return;
                try {
                  await suspendUser(selectedId);
                  setCreators((prev) =>
                    prev.map((u) =>
                      u.id === selectedId ? { ...u, status: "suspended" } : u,
                    ),
                  );
                } catch (e) {
                  console.error("Failed to suspend user", e);
                } finally {
                  setConfirmOpen(false);
                  setSelectedId(null);
                }
              }}
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
