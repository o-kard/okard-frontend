"use client";

import NextLink from "next/link";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useAuth,
  UserButton,
  useReverification,
  useUser,
} from "@clerk/nextjs";
import {
  Avatar,
  Box as MuiBox,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { Camera, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ProfilePanel from "@/modules/user/components/UserShowPanel";
import EditPanel from "@/modules/user/components/UserEditPanel";
import ContributionsPanel from "@/modules/user/components/UserContributionsPanel";
import CampaignsPanel from "@/modules/user/components/UserCampaignsPanel";
import { getUser, updateUser } from "@/modules/user/api/api";
import { fetchPosts } from "@/modules/post/api/api";
import { Post } from "@/modules/post/types/post";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { updateCreator } from "@/modules/creator/api/api";
import { useRequireUserInDb } from "@/hooks/useRequireUserDb";
import { useUpdateUsername } from "@/hooks/useUpdateUsername";
import {
  validateEmail,
  validatePwdPair,
} from "@/utils/validation";
import { getContributeByUserId } from "@/modules/contributor/api/api";
import { ContributorWithPost } from "@/modules/contributor/types";
import { fetchPostById } from "@/modules/post/api/api";

// Optional: gate page behind DB user check
// import { useRequireUserInDb } from "@/hooks/useRequireUserInDb";

// -------------------------------
// Tabs helpers (exported for tests)
// -------------------------------
export type Tab = "profile" | "edit" | "contributions" | "campaigns";

export function getCurrentTab(sp: ReadonlyURLSearchParams): Tab {
  const t = sp.get("tab");
  if (t === "edit" || t === "contributions" || t === "campaigns") return t;
  return "profile"; // default
}

export function buildTabHref(tab: Tab) {
  return `/user?tab=${tab}`;
}

export function isActiveTab(current: Tab, tab: Tab) {
  return current === tab;
}

// -------------------------------
// Main page
// -------------------------------
import { Suspense } from "react";

// ... (imports remain the same, ensuring Suspense is imported from react)

function UserContent() {
  // useRequireUserInDb?.();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const sp = useSearchParams();
  const tab = useMemo(() => getCurrentTab(sp), [sp]);
  const haveUserDb = useRequireUserInDb();
  const { getToken } = useAuth();

  const [profile, setProfile] = useState<any | null>(null);
  const [campaigns, setCampaigns] = useState<Post[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [contributions, setContributions] = useState<ContributorWithPost[]>([]);
  const [contributionsLoading, setContributionsLoading] = useState(true);

  // Username management
  const { updateUsername } = useUpdateUsername();

  // Email management
  const addEmail = useReverification((email: string) =>
    user!.createEmailAddress({ email })
  );
  const setPrimaryEmail = useReverification((id: string) =>
    user!.update({ primaryEmailAddressId: id })
  );
  const destroyEmail = useReverification((emailObj: any) => emailObj.destroy());
  async function handleEmailFlowFromPayload(payload: any): Promise<boolean> {
    if (!isLoaded || !user) return false;

    const desired = (payload?.email ?? "").trim(); // ค่าใหม่จากฟอร์ม (อาจเป็น "" ถ้ากด remove)
    const wantRemove = !!payload?.remove_email; // ธงจากฟอร์ม
    const currentPrimary = user.primaryEmailAddress?.emailAddress ?? "";
    const currentPrimaryId = user.primaryEmailAddress?.id ?? "";
    const all = user.emailAddresses ?? [];

    // ---- REMOVE ----
    if (wantRemove) {
      if (!currentPrimaryId) return true; // ไม่มีอยู่แล้ว
      try {
        // ถ้ามีอีเมลอื่น ให้สลับ primary ไปอันอื่นก่อน (ให้เลือก verified ก่อน)
        const others = all.filter((a) => a.id !== currentPrimaryId);
        if (others.length > 0) {
          const next =
            others.find((a) => a.verification?.status === "verified") ??
            others[0];
          await setPrimaryEmail(next.id);
        }
        // ลบอันเดิม
        await destroyEmail(user.primaryEmailAddress!);
        await user.reload();
        return true;
      } catch (e: any) {
        if (isClerkAPIResponseError(e)) {
          const msg = e.errors
            ?.map((er: any) => er.longMessage || er.message)
            .join("\n");
          alert(msg ?? "Failed to remove email");
          return false;
        }
        console.error(e);
        alert("Failed to remove email");
        return false;
      }
    }

    // ถ้าไม่ตั้งใจ remove:
    // - ถ้า desired ว่าง และไม่มี current → ถือว่า ok (ไม่มีอะไรทำ)
    // - ถ้า desired = current → ok
    if (!desired || desired === currentPrimary) return true;

    // ---- ADD or CHANGE ----
    if (!validateEmail(desired)) {
      alert("Invalid email format");
      return false;
    }

    try {
      // 1) สร้างอีเมลใหม่
      const created = await addEmail(desired);
      await user.reload();

      // หา object อีเมลที่เพิ่งสร้าง
      const after = user.emailAddresses ?? [];
      const emailObj =
        after.find((a) => a.id === created?.id) ||
        after.find((a) => a.emailAddress === desired);
      if (!emailObj) {
        alert("Email object not found after creation");
        return false;
      }

      // 2) ส่งโค้ดยืนยัน
      await emailObj.prepareVerification({ strategy: "email_code" });
      const code = window.prompt(`Enter the 6-digit code sent to ${desired}`);
      if (!code) {
        alert("Verification cancelled");
        return false;
      }
      const res = await emailObj.attemptVerification({ code });
      if (res?.verification?.status !== "verified") {
        alert("Verification failed");
        return false;
      }

      // 3) ตั้งเป็น primary
      await setPrimaryEmail(emailObj.id);

      // 4) (ออปชัน) ถ้าเป็นการเปลี่ยนจากอีเมลเก่า → ลบอีเมลเก่าออก
      if (currentPrimaryId) {
        const old = (user.emailAddresses ?? []).find(
          (a) => a.id === currentPrimaryId
        );
        if (old) {
          try {
            await destroyEmail(old);
          } catch { }
        }
      }

      await user.reload();
      return true;
    } catch (e: any) {
      if (isClerkAPIResponseError(e)) {
        const msg = e.errors
          ?.map((er: any) => er.longMessage || er.message)
          .join("\n");
        alert(msg ?? "Failed to add/verify email");
        return false;
      }
      console.error(e);
      alert("Failed to add/verify email");
      return false;
    }
  }

  // Password management
  const changePassword = useReverification(
    async (p: { newPassword: string }) => {
      if (!user) throw new Error("No user");
      return user.updatePassword({
        newPassword: p.newPassword,
        signOutOfOtherSessions: true,
      });
    }
  );

  // Profile Image
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<{
    file?: File;
    clear?: boolean;
  } | null>(null);
  const [imagePreviewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleAvatarClick = () => {
    if (tab !== "edit" || uploadingAvatar) return;
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingAvatar({ file, clear: false }); // แค่เก็บไว้ + แสดงพรีวิวได้
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAvatarClear = () => {
    if (tab !== "edit") return;
    setConfirmClearOpen(true);
  };

  const handleAvatarClearConfirmed = () => {
    setPreviewUrl(null);
    setPendingAvatar({ clear: true });
    setConfirmClearOpen(false);
  };

  useEffect(() => {
    if (!isLoaded || !user || haveUserDb !== "ok") return;
    let abort = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("No token available");
        const r = await getUser(token);
        console.log("Clerk token:", token);
        if (r) {
          console.log("Fetched user profile:", r);
          if (!abort) setProfile(r);
        }

        // Fetch campaigns
        if (user?.id) {
          const userCampaigns = await fetchPosts(undefined, undefined, "newest", "all", "active", user.id);
          if (!abort) {
            setCampaigns(userCampaigns || []);
            setCampaignsLoading(false);
          }
        }

        // Fetch contributions
        if (profile?.id || r?.id) {
          const userId_ = profile?.id || r?.id;
          const userContribs = await getContributeByUserId(userId_);
          if (!abort) {
            setContributions(userContribs || []);
            setContributionsLoading(false);
          }
        } else {
          if (!abort) setContributionsLoading(false);
        }

        // router.replace("/");
      } catch (err) {
        console.error("Failed to fetch user or campaigns:", err);
        if (!abort) setCampaignsLoading(false);
      }
    })();
    return () => {
      abort = true;
    };
  }, [isLoaded, user, haveUserDb]);

  useEffect(() => {
    if (tab === "edit") {
      setPreviewUrl(user?.hasImage ? user?.imageUrl : null);
    } else {
      setPreviewUrl(user?.imageUrl ?? null);
    }
  }, [tab, user?.imageUrl]);

  const handleEditSubmit = async (fd: FormData) => {
    if (!isLoaded || !user) return;

    const raw = fd.get("data");
    const data = raw ? JSON.parse(String(raw)) : {};
    const newUsername = data?.username as string | undefined;

    const newPw = String(fd.get("password_new") ?? "");
    const confirmPw = String(fd.get("password_confirm") ?? "");
    const pwErr = validatePwdPair(newPw, confirmPw);

    // Get token early for APIs
    const token = await getToken();

    // const imageFile = pendingAvatar?.file ?? null;
    try {
      // Username
      if (newUsername && newUsername !== user.username) {
        const okU = await updateUsername(newUsername);
        if (!okU) return; // ถ้า username ไม่ผ่าน validation หรืออัพเดตไม่สำเร็จ ให้หยุด
      }

      if (pwErr) {
        alert(pwErr);
        return;
      }

      // Password
      if (newPw) {
        try {
          await changePassword({ newPassword: newPw });
          await user.reload();
        } catch (e: any) {
          if (isClerkAPIResponseError(e)) {
            const msg = e.errors
              ?.map((er: any) => er.longMessage || er.message)
              .join("\n");
            alert(msg ?? "Password update failed");
            return; // ❗ ถ้าเปลี่ยน password ไม่สำเร็จ -> หยุดเลย ไม่อัปเดต DB
          }
          console.error(e);
          alert("Password update failed");
          return;
        }
      }

      // อย่าส่ง password ไป backend
      fd.delete("password_new");
      fd.delete("password_confirm");

      // Email
      const okE = await handleEmailFlowFromPayload(data);
      if (!okE) return; // ❗ ถ้าไม่ผ่าน -> ยกเลิก ไม่อัปเดต DB

      if (pendingAvatar?.file) {
        fd.append("image", pendingAvatar.file);
      }
      if (pendingAvatar?.clear) {
        const raw = fd.get("data");
        const data = raw ? JSON.parse(String(raw)) : {};
        data.remove_image = true;
        fd.set("data", JSON.stringify(data));
      }

      // User DB
      const ok = await updateUser(fd, token); // Note: updateUser might need token fix if it fails, but leaving as is for now
      console.log("Submitting updated profile data:", data, fd);

      if (ok) { // Consider success if at least one worked? simplified for now
        if (pendingAvatar?.file)
          await user.setProfileImage({ file: pendingAvatar.file });
        if (pendingAvatar?.clear) await user.setProfileImage({ file: null });
        await user.reload();

        // Refresh profile
        if (token) {
          const refreshed = await getUser(token);
          setProfile(refreshed);
        }

        router.replace(buildTabHref("profile"));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to update profile");
    }
  };

  return (
    <>
      <SignedIn>
        <MuiBox
          sx={{
            p: { xs: 1, md: 4 },
            background: "#f3f4f6",
            minHeight: "100vh",
          }}
        >
          <Grid container spacing={2}>
            {/* Left rail */}
            <Grid size={{ xs: 12, md: 3, lg: 2.5 }}>
              <Paper
                sx={{
                  py: 4, // padding-top + padding-bottom = 32px (4 * 8px)
                  px: 2,
                  borderRadius: 3,
                }}
              >
                {/* Header area (avatar + actions) */}
                {tab === "edit" ? (
                  <MuiBox sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                    <MuiBox sx={{ position: "relative" }}>
                      <MuiBox
                        component="label"
                        sx={{
                          cursor: "pointer",
                          display: "inline-block",
                          position: "relative",
                          "&:hover": { opacity: 0.9 },
                        }}
                      >
                        <Avatar
                          src={imagePreviewUrl ?? undefined}
                          sx={{
                            width: 120,
                            height: 120,
                            border: "3px dashed",
                            borderColor: imagePreviewUrl
                              ? "primary.main"
                              : "grey.300",
                            bgcolor: imagePreviewUrl
                              ? "transparent"
                              : "grey.100",
                          }}
                        >
                          {!imagePreviewUrl && (
                            <Camera size={40} color="#9e9e9e" />
                          )}
                        </Avatar>
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleAvatarFileChange}
                        />
                      </MuiBox>

                      <IconButton
                        onClick={handleAvatarClick}
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          bgcolor: "primary.main",
                          color: "white",
                          width: 36,
                          height: 36,
                          "&:hover": {
                            bgcolor: "primary.dark",
                          },
                        }}
                      >
                        <Camera size={18} />
                        <input
                          ref={fileInputRef}
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleAvatarFileChange}
                        />
                      </IconButton>

                      {(user?.hasImage || pendingAvatar) && (
                        <IconButton
                          onClick={handleAvatarClear}
                          disabled={uploadingAvatar}
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bgcolor: "error.main",
                            color: "white",
                            width: 28,
                            height: 28,
                            "&:hover": {
                              bgcolor: "error.dark",
                            },
                          }}
                        >
                          <X size={16} />
                        </IconButton>
                      )}

                      {uploadingAvatar && (
                        <MuiBox
                          sx={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(255,255,255,0.4)",
                            borderRadius: "50%",
                          }}
                        >
                          <CircularProgress size={28} />
                        </MuiBox>
                      )}
                    </MuiBox>
                  </MuiBox>
                ) : (
                  // ===== SHOW LAYOUT (ปกติ: รูปซ้าย ข้อความขวา) =====
                  <MuiBox sx={{ mb: 2 }}>
                    <MuiBox
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Avatar
                        src={user?.imageUrl ?? undefined}
                        alt={user?.fullName ?? "User"}
                        sx={{ width: 130, height: 130 }}
                      />
                      <Typography mt={1} fontWeight={700} textAlign="center">
                        {user?.username ?? "—"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                      >
                        {user?.primaryEmailAddress?.emailAddress ?? ""}
                      </Typography>
                    </MuiBox>
                  </MuiBox>
                )}

                <Divider sx={{ my: 3 }} />

                <List>
                  <NavItem
                    href={buildTabHref("profile")}
                    icon={<PersonIcon />}
                    label="Profile"
                    active={isActiveTab(tab, "profile")}
                  />
                  <NavItem
                    href={buildTabHref("edit")}
                    icon={<EditIcon />}
                    label="Edit Profile"
                    active={isActiveTab(tab, "edit")}
                  />
                  <NavItem
                    href={buildTabHref("contributions")}
                    icon={<AssignmentTurnedInIcon />}
                    label="Contributions"
                    active={isActiveTab(tab, "contributions")}
                  />
                  <NavItem
                    href={buildTabHref("campaigns")}
                    icon={<DashboardCustomizeIcon />}
                    label="My Campaigns"
                    active={isActiveTab(tab, "campaigns")}
                  />
                </List>
              </Paper>
            </Grid>

            {/* Main content area (same page; only component changes) */}
            <Grid size={{ xs: 12, md: 9, lg: 9 }}>
              {tab === "profile" && <ProfilePanel campaignCount={campaigns.length} contributionsCount={contributions.length} />}
              {tab === "edit" && (
                <EditPanel onSubmit={handleEditSubmit} initial={profile} />
              )}
              {tab === "contributions" && <ContributionsPanel contributions={contributions} loading={contributionsLoading} />}
              {tab === "campaigns" && <CampaignsPanel campaigns={campaigns} loading={campaignsLoading} />}
            </Grid>
          </Grid>
        </MuiBox>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <Dialog
        open={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
      >
        <DialogTitle>ลบรูปโปรไฟล์?</DialogTitle>
        <DialogContent>คุณต้องการลบรูปโปรไฟล์ปัจจุบันหรือไม่</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClearOpen(false)}>ยกเลิก</Button>
          <Button color="error" onClick={handleAvatarClearConfirmed}>
            ลบ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function UserPage() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <UserContent />
    </Suspense>
  );
}

function NavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        component={NextLink}
        href={href}
        selected={active}
        sx={{ borderRadius: 2, mb: 0.5 }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
}
