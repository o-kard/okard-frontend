"use client";
import AdminLayout from "../AdminLayout";
import { useState } from "react";
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
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ImageList,
  ImageListItem,
  Tooltip,
} from "@mui/material";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useEffect } from "react";
import {
  getReports,
  updateReportStatus,
  deleteReport,
} from "@/modules/report/api/api";
import { listUsers } from "@/modules/user/api/api";
import { fetchCampaigns } from "@/modules/campaign/api/api";
import { ReportStatus } from "@/modules/report/types/report";
import { resolveMediaUrl } from "@/utils/mediaUrl";

const statusColors: Record<string, string> = {
  pending: "#ff8000",
  resolved: "#12C998",
};

const ActionMenu = ({
  reportId,
  status,
  onStatusChange,
  onDelete,
}: {
  reportId: string;
  status: string;
  onStatusChange: (id: string, s: ReportStatus) => void;
  onDelete: (id: string) => void;
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
        {status === "pending" && (
          <MenuItem
            onClick={(e) => {
              handleClose(e);
              onStatusChange(reportId, "resolved");
            }}
            sx={{
              fontSize: "0.9rem",
              color: "#12C998",
              "&:hover": { background: "rgba(18, 201, 152, 0.08)" },
            }}
          >
            Mark Resolved
          </MenuItem>
        )}
        <MenuItem
          onClick={(e) => {
            handleClose(e);
            onDelete(reportId);
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

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const loadReports = async () => {
    try {
      const [reps, users, campaigns] = await Promise.all([
        getReports(),
        listUsers(),
        fetchCampaigns(),
      ]);

      const reportsData = reps.map((report) => {
        const user = users.find((u) => u.id === report.reporter_id);
        const campaign = campaigns.find((c) => c.id === report.campaign_id);
        return {
          id: report.id,
          project: campaign
            ? campaign.campaign_header
            : "Unknown Campaign (or Global)",
          header: report.header || "-",
          reporter: user ? user.username : "Unknown User",
          reason:
            report.type + (report.description ? `: ${report.description}` : ""),
          status: report.status,
          files: report.files || [],
        };
      });
      setReports(reportsData);
    } catch (err) {
      console.error("Failed to load reports", err);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleStatusChange = async (id: string, s: ReportStatus) => {
    try {
      await updateReportStatus(id, s);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: s } : r)),
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete report", err);
    }
  };

  const filtered = reports.filter(
    (r) =>
      r.project.toLowerCase().includes(search.toLowerCase()) ||
      r.header.toLowerCase().includes(search.toLowerCase()) ||
      r.reporter.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase()),
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
              Reports
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#666666", mt: 1, fontWeight: 400 }}
            >
              Review and manage user reported content.
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
            placeholder="Search reports..."
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
            label={`${filtered.length} Reports`}
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
                  Project
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
                  Header
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
                  Reporter
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
                  Reason
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
                  align="center"
                  sx={{
                    fontWeight: 600,
                    color: "#666666",
                    textTransform: "uppercase",
                    fontSize: "0.8rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  Attachments
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
              {filtered.map((r, index) => (
                <TableRow
                  key={r.id}
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
                        {r.project.charAt(0).toUpperCase()}
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
                        {r.project}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#64748b",
                        fontSize: "0.9rem",
                      }}
                    >
                      {r.header}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#666666" }}>
                    {r.reporter}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#666666" }}>
                    {r.reason}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={r.status}
                      sx={{
                        background: `${statusColors[r.status]}20`,
                        color: statusColors[r.status],
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        px: 1,
                        borderRadius: 1.5,
                        border: `1px solid ${statusColors[r.status]}50`,
                        textTransform: "capitalize",
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {r.files.length > 0 ? (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(r);
                          setViewerOpen(true);
                        }}
                        sx={{ color: "#12C998" }}
                      >
                        <Badge
                          badgeContent={r.files.length}
                          color="secondary"
                          sx={{
                            "& .MuiBadge-badge": {
                              bgcolor: "#F472B6",
                              color: "white",
                            },
                          }}
                        >
                          <FilePresentIcon fontSize="small" />
                        </Badge>
                      </IconButton>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <ActionMenu
                      reportId={r.id}
                      status={r.status}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
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
                No reports found
              </Typography>
              <Typography variant="body2" sx={{ color: "#666666", mt: 0.5 }}>
                We couldn't find any reports matching "{search}"
              </Typography>
            </Stack>
          )}
        </TableContainer>

        <Dialog
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              borderRadius: "1rem",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              color: "#222222",
            }}
          >
            <Box
              sx={{
                p: 1,
                bgcolor: "rgba(18, 201, 152, 0.1)",
                borderRadius: "0.75rem",
                display: "flex",
                color: "#12C998",
              }}
            >
              <FilePresentIcon />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#222222" }}>
                Attachments for {selectedReport?.project}
              </Typography>
              {selectedReport?.header && (
                <Typography
                  variant="caption"
                  sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}
                >
                  {selectedReport.header}
                </Typography>
              )}
            </Box>
          </DialogTitle>
          <DialogContent dividers sx={{ bgcolor: "#f8fafc", py: 3 }}>
            <Stack spacing={2.5}>
              {selectedReport?.files.map((file: any, i: number) => {
                const isImage = file.media_type.startsWith("image/");
                const isPdf = file.media_type === "application/pdf";
                const url = resolveMediaUrl(file.path);

                return (
                  <Box
                    key={i}
                    sx={{
                      p: 2.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      bgcolor: "#ffffff",
                      borderRadius: "1rem",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        borderColor: "rgba(18, 201, 152, 0.4)",
                      },
                    }}
                  >
                    {isImage ? (
                      <Box
                        component="img"
                        src={url}
                        alt={file.orig_name}
                        sx={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: "0.75rem",
                          border: "2px solid #f1f5f9",
                        }}
                      />
                    ) : isPdf ? (
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255, 82, 82, 0.1)",
                          color: "#ff5252",
                          width: 64,
                          height: 64,
                          borderRadius: "0.75rem",
                        }}
                        variant="rounded"
                      >
                        <PictureAsPdfIcon sx={{ fontSize: 32 }} />
                      </Avatar>
                    ) : (
                      <Avatar
                        sx={{
                          bgcolor: "rgba(100, 116, 139, 0.1)",
                          color: "#64748b",
                          width: 64,
                          height: 64,
                          borderRadius: "0.75rem",
                        }}
                        variant="rounded"
                      >
                        <FilePresentIcon sx={{ fontSize: 32 }} />
                      </Avatar>
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: "#222222" }}
                      >
                        {file.orig_name}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mt: 0.5 }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#64748b",
                            fontWeight: 500,
                            textTransform: "uppercase",
                          }}
                        >
                          {file.media_type || "File"}
                        </Typography>
                        {file.file_size && (
                          <>
                            <Box
                              sx={{
                                width: 3,
                                height: 3,
                                bgcolor: "#cbd5e1",
                                borderRadius: "50%",
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: "#64748b", fontWeight: 500 }}
                            >
                              {(file.file_size / 1024).toFixed(1)} KB
                            </Typography>
                          </>
                        )}
                      </Stack>
                    </Box>
                    <Button
                      variant="contained"
                      size="medium"
                      startIcon={<VisibilityIcon />}
                      onClick={() => window.open(url, "_blank")}
                      sx={{
                        borderRadius: "0.75rem",
                        bgcolor: "#12C998",
                        fontWeight: 700,
                        px: 3,
                        "&:hover": {
                          bgcolor: "#0ea87e",
                          boxShadow: "0 4px 12px rgba(18, 201, 152, 0.3)",
                        },
                        boxShadow: "none",
                      }}
                    >
                      VIEW
                    </Button>
                  </Box>
                );
              })}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, bgcolor: "#ffffff" }}>
            <Button
              onClick={() => setViewerOpen(false)}
              sx={{
                fontWeight: 700,
                color: "#64748b",
                px: 3,
                "&:hover": { bgcolor: "rgba(0,0,0,0.03)" },
              }}
            >
              CLOSE
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}
