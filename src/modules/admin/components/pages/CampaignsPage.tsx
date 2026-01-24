"use client";
import AdminLayout from "../AdminLayout";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Button, TextField, InputAdornment, Chip } from "@mui/material";
import { fetchPosts, changeStatus } from "@/modules/post/api/api";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useAuth } from "@clerk/nextjs";

const statusColors: Record<string, string> = {
  active: "#1de9b6",
  suspended: "#ff5252",
  pending: "#ffd600",
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
      <h1
        style={{
          fontSize: "1.7rem",
          fontWeight: 700,
          marginBottom: "2rem",
          color: "#1de9b6",
        }}
      >
        Campaigns
      </h1>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 16,
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
                <SearchIcon style={{ color: "#7de2d1" }} />
              </InputAdornment>
            ),
            style: { background: "#22304a", color: "#e6f7fa", borderRadius: 8 },
          }}
          sx={{ width: 320 }}
        />
      </div>
      <div
        style={{
          background: "#22304a",
          borderRadius: 16,
          padding: 0,
          overflow: "auto",
          boxShadow: "0 2px 16px 0 #10151f33",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            color: "#e6f7fa",
            fontSize: 15,
          }}
        >
          <thead>
            <tr style={{ background: "rgba(29,233,182,0.08)" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "16px 20px",
                  fontWeight: 600,
                  letterSpacing: 0.2,
                }}
              >
                Campaign
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "16px 20px",
                  fontWeight: 600,
                  letterSpacing: 0.2,
                }}
              >
                Creator
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "16px 20px",
                  fontWeight: 600,
                  letterSpacing: 0.2,
                }}
              >
                Category
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "16px 20px",
                  fontWeight: 600,
                  letterSpacing: 0.2,
                }}
              >
                Status
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "16px 20px",
                  fontWeight: 600,
                  letterSpacing: 0.2,
                }}
              >
                Goal
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "16px 20px",
                  fontWeight: 600,
                  letterSpacing: 0.2,
                }}
              >
                Raised
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "16px 20px",
                  fontWeight: 600,
                  letterSpacing: 0.2,
                }}
              >
                Progress
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "16px 20px",
                  fontWeight: 600,
                  letterSpacing: 0.2,
                }}
              >
                Created At
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "16px 20px",
                  fontWeight: 600,
                  letterSpacing: 0.2,
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                style={{
                  borderTop: "1px solid #26334d",
                  transition: "background 0.18s cubic-bezier(.4,0,.2,1)",
                  cursor: "pointer",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#1a2333")
                }
                onMouseOut={(e) => (e.currentTarget.style.background = "none")}
              >
                <td style={{ padding: "14px 20px", fontWeight: 500 }}>
                  {p.name}
                </td>
                <td style={{ padding: "14px 20px" }}>{p.creator}</td>
                <td style={{ padding: "14px 20px" }}>{p.category}</td>
                <td style={{ padding: "14px 20px" }}>
                  <Chip
                    label={p.status}
                    sx={{
                      background: statusColors[p.status],
                      color: "#181f2a",
                      fontWeight: 700,
                      fontSize: 13,
                      px: 1.5,
                      borderRadius: 1.5,
                      boxShadow: "0 1px 4px #0002",
                    }}
                    size="small"
                  />
                </td>
                <td style={{ padding: "14px 20px", textAlign: "right" }}>
                  ${p.goal.toLocaleString()}
                </td>
                <td style={{ padding: "14px 20px", textAlign: "right" }}>
                  ${p.raised.toLocaleString()}
                </td>
                <td style={{ padding: "14px 20px", textAlign: "center" }}>
                  {p.progress}%
                </td>
                <td style={{ padding: "14px 20px", textAlign: "center" }}>
                  {formatDate(p.created_at)}
                </td>
                <td style={{ padding: "14px 20px", textAlign: "center" }}>
                  <Button
                    href={`/post/show/${p.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    variant="outlined"
                    sx={{
                      color: "#1de9b6",
                      borderColor: "#1de9b6",
                      mr: 1,
                      borderRadius: 2,
                      fontWeight: 600,
                      transition: "all 0.18s",
                      "&:hover": {
                        background: "#1de9b622",
                        borderColor: "#1de9b6",
                      },
                    }}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      color: p.status === "active" ? "#ffd600" : "#1de9b6",
                      borderColor: p.status === "active" ? "#ffd600" : "#1de9b6",
                      mr: 1,
                      borderRadius: 2,
                      fontWeight: 600,
                      transition: "all 0.18s",
                      "&:hover": {
                        background:
                          p.status === "active" ? "#ffd60022" : "#1de9b622",
                        borderColor: p.status === "active" ? "#ffd600" : "#1de9b6",
                      },
                    }}
                    onClick={() => {
                      setSelectedId(p.id);
                      setConfirmOpen(true);
                    }}
                  >
                    {p.status === "active" ? "Suspend" : "Activate"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: "center", color: "#7de2d1" }}>
            No campaigns found.
          </div>
        )}
      </div>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Admin Action</DialogTitle>
        <DialogContent>
          Do you want to suspend this campaign?
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
    </AdminLayout>
  );
}
